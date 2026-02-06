// import prisma from "../lib/prisma.js";


// export async function checkoutHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     // load cart & items
//     const cart = await prisma.cart.findUnique({
//       where: { userId },
//       include: {
//         cartItems: {
//           include: { productItem: true }
//         }
//       }
//     });

//     if (!cart || cart.cartItems.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     // Validate stock
//     for (const ci of cart.cartItems) {
//       const p = ci.productItem;
//       if (!p) return res.status(400).json({ success: false, message: "Product item missing" });
//       if (p.status !== "ACTIVE") return res.status(400).json({ success: false, message: `Product ${p.id} is not available` });
//       if (ci.quantity > p.quantity_instock) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for productItem ${p.id}` });
//       }
//     }

//     // Calculate total
//     const total = cart.cartItems.reduce((s, ci) => s + Number(ci.productItem.price) * ci.quantity, 0);

//     // find pending order_status row (if exists) otherwise null
//     const pendingStatus = await prisma.orderStatus.findFirst({ where: { status: "PENDING" } });

//     // Build create payload for nested orderProducts
//     const orderProductsCreate = cart.cartItems.map(ci => ({
//       productItem: { connect: { id: ci.product_itemId } }, // connect to productItem
//       user: { connect: { id: userId } },
//       quantity: ci.quantity,
//       price: Number(ci.productItem.price),
//     }));

//     // Transaction: create order, decrement stock, remove cartItems
//     const result = await prisma.$transaction(async (tx) => {
//       // create order
//       const order = await tx.order.create({
//         data: {
//           user: { connect: { id: userId } },
//           order_total: Math.round(total * 100) / 100, // keep numeric
//           order_status: pendingStatus ? { connect: { id: pendingStatus.id } } : undefined,
//           orderProducts: { create: orderProductsCreate },
//         },
//         include: {
//           orderProducts: { include: { productItem: true } }
//         }
//       });

//       // decrement stock for each productItem
//       for (const ci of cart.cartItems) {
//         const newQty = ci.productItem.quantity_instock - ci.quantity;
//         await tx.productItem.update({
//           where: { id: ci.product_itemId },
//           data: { quantity_instock: newQty < 0 ? 0 : newQty }
//         });
//       }

//       // clear cart items
//       await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

//       return order;
//     });

//     return res.json({ success: true, order: result });
//   } catch (err) {
//     console.error("checkoutHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

// export async function myOrdersHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const orders = await prisma.order.findMany({
//       where: { userId },
//       orderBy: { id: "desc" },
//       include: {
//         orderProducts: {
//           include: {
//             productItem: { include: { product: true } }
//           }
//         },
//         order_status: true
//       }
//     });

//     return res.json({ success: true, orders });
//   } catch (err) {
//     console.error("myOrdersHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }


// export async function getOrderByIdHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const id = Number(req.params.id);
//     if (!id) return res.status(400).json({ success: false, message: "Order id required" });

//     const order = await prisma.order.findUnique({
//       where: { id },
//       include: {
//         orderProducts: {
//           include: {
//             productItem: { include: { product: true, user: { select: { id: true, name: true, avatar: true } } } }
//           }
//         },
//         order_status: true,
//         user: { select: { id: true, name: true } }
//       }
//     });

//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

//     // allow admin or owner
//     if (req.user.role !== "ADMIN" && order.userId !== userId) {
//       return res.status(403).json({ success: false, message: "Forbidden" });
//     }

//     return res.json({ success: true, order });
//   } catch (err) {
//     console.error("getOrderByIdHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }


// export async function adminListOrdersHandler(req, res) {
//   try {
//     if (!req.user || req.user.role !== "ADMIN") {
//       return res.status(403).json({ success: false, message: "Admin access required" });
//     }

//     const orders = await prisma.order.findMany({
//       orderBy: { id: "desc" },
//       include: {
//         orderProducts: { include: { productItem: { include: { product: true } } } },
//         user: { select: { id: true, name: true, email: true } },
//         order_status: true
//       }
//     });

//     return res.json({ success: true, orders });
//   } catch (err) {
//     console.error("adminListOrdersHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }


// export async function adminUpdateOrderStatusHandler(req, res) {
//   try {
//     if (!req.user || req.user.role !== "ADMIN") {
//       return res.status(403).json({ success: false, message: "Admin access required" });
//     }

//     const id = Number(req.params.id);
//     const { status } = req.body;
//     if (!id || !status) return res.status(400).json({ success: false, message: "id and status required" });

//     // find or create status row
//     let statusRow = await prisma.orderStatus.findFirst({ where: { status } });
//     if (!statusRow) {
//       statusRow = await prisma.orderStatus.create({ data: { status } });
//     }

//     // If changing to CANCELLED, we must restock productItems
//     const order = await prisma.order.findUnique({
//       where: { id },
//       include: {
//         orderProducts: { include: { productItem: true } }
//       }
//     });
//     if (!order) return res.status(404).json({ success: false, message: "Order not found" });

//     const prevStatusId = order.order_statusId;

//     // Transaction: update status and restock if cancelling
//     const updated = await prisma.$transaction(async (tx) => {
//       // if cancelling and previously not cancelled -> restock
//       if (status.toUpperCase() === "CANCELLED") {
//         for (const op of order.orderProducts) {
//           await tx.productItem.update({
//             where: { id: op.product_itemId },
//             data: { quantity_instock: { increment: op.quantity } }
//           });
//         }
//       }

//       const upd = await tx.order.update({
//         where: { id },
//         data: { order_status: { connect: { id: statusRow.id } } },
//         include: { orderProducts: { include: { productItem: { include: { product: true } } } }, order_status: true }
//       });

//       return upd;
//     });

//     return res.json({ success: true, order: updated });
//   } catch (err) {
//     console.error("adminUpdateOrderStatusHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

// src/actions/orderActions.js
import prisma from "../lib/prisma.js";

async function getOrderStatusId(statusString) {
  let s = await prisma.orderStatus.findFirst({ where: { status: statusString } });
  if (!s) {
    s = await prisma.orderStatus.create({ data: { status: statusString } });
  }
  return s.id;
}


// export async function checkoutHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     // load cart with items & productItem info (fresh)
//     const cart = await prisma.cart.findUnique({
//       where: { id: await (async () => {
//         // find cart id for user (we assume cart has unique id, so query by userId)
//         const c = await prisma.cart.findFirst({ where: { userId }});
//         return c ? c.id : null;
//       })() },
//       include: {
//         cartItems: { include: { productItem: true } }
//       }
//     });

//     if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     // validate stock & calculate
//     for (const ci of cart.cartItems) {
//       if (!ci.productItem) {
//         return res.status(400).json({ success: false, message: "Invalid cart item" });
//       }
//       if (ci.quantity > ci.productItem.quantity_instock) {
//         return res.status(400).json({ success: false, message: `Insufficient stock for item ${ci.productItemId}` });
//       }
//       if (ci.productItem.status !== "ACTIVE") {
//         return res.status(400).json({ success: false, message: `Product item not available` });
//       }
//     }

//     const total = cart.cartItems.reduce((s, ci) => s + Number(ci.productItem.price) * ci.quantity, 0);

//     const pendingStatusId = await getOrderStatusId("PENDING");

//     // transaction: create order, create orderProducts, decrement stock, clear cart items
//     const result = await prisma.$transaction(async (tx) => {
//       const createdOrder = await tx.order.create({
//         data: {
//           user: { connect: { id: userId } },
//           order_total: Math.round(total), // or keep decimals per your schema, adjust if necessary
//           order_statusId: pendingStatusId,
//           orderProducts: {
//             create: cart.cartItems.map((ci) => ({
//               productItem: { connect: { id: ci.productItem.id } },
//               user: { connect: { id: userId } },
//               quantity: ci.quantity,
//               price: Number(ci.productItem.price),
//             })),
//           },
//         },
//         include: { orderProducts: true }
//       });

//       // Decrement stock for each productItem
//       for (const ci of cart.cartItems) {
//         const newQty = ci.productItem.quantity_instock - ci.quantity;
//         const updateData = { quantity_instock: newQty >= 0 ? newQty : 0 };
//         if (newQty <= 0) {
//           // if you want to mark productItem inactive when out of stock, do it:
//           updateData.isActive = false;
//         }
//         await tx.productItem.update({
//           where: { id: ci.productItem.id },
//           data: updateData,
//         });
//       }

//       // clear cart items
//       await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

//       return createdOrder;
//     });

//     return res.json({ success: true, order: result });
//   } catch (err) {
//     console.error("checkoutHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }



// export async function checkoutHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     // get cart with items
//     const cart = await prisma.cart.findFirst({
//       where: { userId },
//       include: {
//         cartItems: {
//           include: {
//             productItem: true,
//           },
//         },
//       },
//     });

//     if (!cart || cart.cartItems.length === 0)
//       return res.status(400).json({ success: false, message: "Cart is empty" });

//     // calculate total
//     const total = cart.cartItems.reduce(
//       (sum, ci) => sum + Number(ci.productItem.price) * ci.quantity,
//       0
//     );

//     // get default order status "PENDING"
//     const pendingStatus = await prisma.orderStatus.findFirst({
//       where: { status: "PENDING" },
//     });

//     if (!pendingStatus)
//       return res
//         .status(500)
//         .json({ success: false, message: "Order status not configured" });

//     // create order (TRANSACTION SAFE)
//     const order = await prisma.$transaction(async (tx) => {
//       const createdOrder = await tx.order.create({
//         data: {
//           user: { connect: { id: userId } },
//           order_total: total,

//           // ✅ CORRECT RELATION CONNECT
//           order_status: {
//             connect: { id: pendingStatus.id },
//           },

//           orderProducts: {
//             create: cart.cartItems.map((ci) => ({
//               productItem: { connect: { id: ci.product_itemId } },
//               user: { connect: { id: userId } },
//               quantity: ci.quantity,
//               price: Number(ci.productItem.price),
//             })),
//           },
//         },
//         include: { orderProducts: true },
//       });

//       // clear cart
//       await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

//       return createdOrder;
//     });

//     return res.json({ success: true, order });
//   } catch (err) {
//     console.error("checkoutHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }


// export async function checkoutHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     // 1️⃣ get cart
//     const cart = await prisma.cart.findFirst({
//       where: { userId },
//       include: {
//         cartItems: {
//           include: { productItem: true },
//         },
//       },
//     });

//     if (!cart || cart.cartItems.length === 0)
//       return res.status(400).json({ success: false, message: "Cart empty" });

//     // 2️⃣ total
//     const total = cart.cartItems.reduce(
//       (sum, ci) => sum + Number(ci.productItem.price) * ci.quantity,
//       0
//     );

//     // 3️⃣ find CONFIRMED order status
//     const confirmedStatus = await prisma.orderStatus.findFirst({
//       where: { status: "CONFIRMED" },
//     });

//     // 4️⃣ create order
//     const order = await prisma.order.create({
//       data: {
//         user: { connect: { id: userId } },
//         order_total: total,

//         order_status: {
//           connect: { id: confirmedStatus.id },
//         },

//         orderProducts: {
//           create: cart.cartItems.map((ci) => ({
//             productItem: { connect: { id: ci.product_itemId } },
//             user: { connect: { id: userId } },
//             quantity: ci.quantity,
//             price: Number(ci.productItem.price),
//           })),
//         },
//       },
//     });

//     // 5️⃣ clear cart
//     await prisma.cartItem.deleteMany({
//       where: { cartId: cart.id },
//     });

//     return res.json({ success: true, order });

//   } catch (err) {
//     console.error("checkoutHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

export async function checkoutHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // load cart with items and productItem info
    const cart = await prisma.cart.findUnique({
      where: { id: (await prisma.cart.findFirst({ where: { userId } }))?.id || undefined }
    });

    // safer get: find cart by userId using findFirst or findMany because we don't have unique by userId
    const fullCart = await prisma.cart.findFirst({
      where: { userId },
      include: {
        cartItems: {
          include: {
            productItem: true
          }
        }
      }
    });

    if (!fullCart || fullCart.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // calculate total
    const total = fullCart.cartItems.reduce((sum, ci) => sum + Number(ci.productItem.price) * ci.quantity, 0);

    // ensure an OrderStatus "PENDING" exists
    let pendingStatus = await prisma.orderStatus.findFirst({ where: { status: "PENDING" } });
    if (!pendingStatus) {
      pendingStatus = await prisma.orderStatus.create({ data: { status: "PENDING" } });
    }

    // create order and orderProducts in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          order_total: total,
          order_status: { connect: { id: pendingStatus.id } },
          orderProducts: {
            create: fullCart.cartItems.map((ci) => ({
              productItem: { connect: { id: ci.product_itemId } },
              user: { connect: { id: userId } },
              quantity: ci.quantity,
              price: Number(ci.productItem.price)
            }))
          }
        },
        include: { orderProducts: true }
      });

      // create payment stub (PENDING)
      await tx.payment.create({
        data: {
          order: { connect: { id: created.id } },
          amount: total,
          status: "PENDING"
        }
      });

      // clear cart items
      await tx.cartItem.deleteMany({ where: { cartId: fullCart.id } });

      return created;
    });

    return res.json({ success: true, order });
  } catch (err) {
    console.error("checkoutHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}


export async function verifyPaymentHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { orderId, paymentId, provider, signature, payload } = req.body;
    if (!orderId || !paymentId) return res.status(400).json({ success: false, message: "orderId & paymentId required" });

    // load payment record (we created a pending payment at checkout)
    const payment = await prisma.payment.findFirst({ where: { orderId: Number(orderId) } });
    if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });

    // --- Provider verification step ---
    let verified = false;

    if (provider === "mock") {
      // Mock provider for local testing — always verify
      verified = true;
    } else if (provider === "razorpay") {
      // TODO: verify signature here using your RAZORPAY_SECRET
      // Example (Node):
      // const expected = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
      //   .update(paymentId + '|' + orderId)
      //   .digest('hex');
      // verified = expected === signature;
      verified = false; // placeholder — implement real verification
    } else if (provider === "stripe") {
      // TODO: verify signature using Stripe SDK / webhook secret
      verified = false;
    } else {
      // Unknown provider: reject
      return res.status(400).json({ success: false, message: "Unknown payment provider" });
    }

    if (!verified) {
      // mark payment failed
      await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // mark payment as PAID and update order status to CONFIRMED
    let confirmedStatus = await prisma.orderStatus.findFirst({ where: { status: "CONFIRMED" } });
    if (!confirmedStatus) {
      confirmedStatus = await prisma.orderStatus.create({ data: { status: "CONFIRMED" } });
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", provider: provider ?? null, provider_payment_id: paymentId ?? null }
      }),
      prisma.order.update({
        where: { id: Number(orderId) },
        data: { order_status: { connect: { id: confirmedStatus.id } } }
      })
    ]);

    return res.json({ success: true, message: "Payment verified and order confirmed" });
  } catch (err) {
    console.error("verifyPaymentHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}




export async function getMyOrdersHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: {
        orderProducts: {
          include: {
            productItem: { include: { product: true, user: { select: { id: true, name: true, avatar: true } } } }
          }
        },
        order_status: true
      }
    });

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("getMyOrdersHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}


export async function getOrderByIdHandler(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "id required" });

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderProducts: { include: { productItem: { include: { product: true, user: { select: { id: true, name: true } } } } } },
        order_status: true,
        user: { select: { id: true, name: true, email: true } }
      }
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // if not admin and not owner -> forbidden
    if (req.user.role !== "ADMIN" && order.userId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error("getOrderByIdHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}


export async function adminListOrdersHandler(req, res) {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const orders = await prisma.order.findMany({
      orderBy: { id: "desc" },
      include: {
        orderProducts: { include: { productItem: { include: { product: true, user: { select: { id: true, name: true } } } } } },
        order_status: true,
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("adminListOrdersHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function adminUpdateOrderStatusHandler(req, res) {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const id = Number(req.params.id);
    const { status } = req.body;
    if (!id || !status) return res.status(400).json({ success: false, message: "id and status required" });

    // get/create status id
    const statusId = await getOrderStatusId(status.toString());

    const updated = await prisma.order.update({
      where: { id },
      data: { order_statusId: statusId },
      include: { orderProducts: true, order_status: true }
    });

    return res.json({ success: true, order: updated });
  } catch (err) {
    console.error("adminUpdateOrderStatusHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function sellerOrdersHandler(req, res) {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user.role !== "SELLER") return res.status(403).json({ success: false, message: "Seller role required" });

    const orders = await prisma.order.findMany({
      where: {
        orderProducts: {
          some: { productItem: { userId: sellerId } }
        }
      },
      orderBy: { id: "desc" },
      include: {
        orderProducts: {
          include: {
            productItem: {
              include: { product: true, user: { select: { id: true, name: true } } }
            }
          }
        },
        order_status: true,
        user: { select: { id: true, name: true } }
      }
    });

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("sellerOrdersHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
