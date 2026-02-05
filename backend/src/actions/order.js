// import prisma from "../lib/prisma.js";

// export async function checkoutHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     // get cart with items
//     const cart = await prisma.cart.findUnique({
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

//     // create order
//     const order = await prisma.order.create({
//       data: {
//         user: { connect: { id: userId } },
//         order_total: total,
//         orderProducts: {
//           create: cart.cartItems.map((ci) => ({
//             productItem: { connect: { id: ci.product_itemId } },
//             user: { connect: { id: userId } },
//             quantity: ci.quantity,
//             price: Number(ci.productItem.price),
//           })),
//         },
//       },
//       include: { orderProducts: true },
//     });

//     // clear cart
//     await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

//     return res.json({ success: true, order });
//   } catch (err) {
//     console.error("checkoutHandler error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

// export async function myOrdersHandler(req, res) {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ success: false });

//     const orders = await prisma.order.findMany({
//       where: { userId },
//       orderBy: { id: "desc" },
//       include: {
//         orderItems: {
//           include: {
//             productItem: {
//               include: { product: true }
//             }
//           }
//         }
//       }
//     });

//     return res.json({ success: true, orders });

//   } catch (err) {
//     console.error("myOrders error", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// }

// actions/order.js
import prisma from "../lib/prisma.js";

/**
 * Checkout: create Order from user's cart atomically.
 * - checks stock
 * - reduces productItem.quantity_instock
 * - creates order + orderProducts
 * - clears cart items
 */
export async function checkoutHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    // load cart & items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: { productItem: true }
        }
      }
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Validate stock
    for (const ci of cart.cartItems) {
      const p = ci.productItem;
      if (!p) return res.status(400).json({ success: false, message: "Product item missing" });
      if (p.status !== "ACTIVE") return res.status(400).json({ success: false, message: `Product ${p.id} is not available` });
      if (ci.quantity > p.quantity_instock) {
        return res.status(400).json({ success: false, message: `Insufficient stock for productItem ${p.id}` });
      }
    }

    // Calculate total
    const total = cart.cartItems.reduce((s, ci) => s + Number(ci.productItem.price) * ci.quantity, 0);

    // find pending order_status row (if exists) otherwise null
    const pendingStatus = await prisma.orderStatus.findFirst({ where: { status: "PENDING" } });

    // Build create payload for nested orderProducts
    const orderProductsCreate = cart.cartItems.map(ci => ({
      productItem: { connect: { id: ci.product_itemId } }, // connect to productItem
      user: { connect: { id: userId } },
      quantity: ci.quantity,
      price: Number(ci.productItem.price),
    }));

    // Transaction: create order, decrement stock, remove cartItems
    const result = await prisma.$transaction(async (tx) => {
      // create order
      const order = await tx.order.create({
        data: {
          user: { connect: { id: userId } },
          order_total: Math.round(total * 100) / 100, // keep numeric
          order_status: pendingStatus ? { connect: { id: pendingStatus.id } } : undefined,
          orderProducts: { create: orderProductsCreate },
        },
        include: {
          orderProducts: { include: { productItem: true } }
        }
      });

      // decrement stock for each productItem
      for (const ci of cart.cartItems) {
        const newQty = ci.productItem.quantity_instock - ci.quantity;
        await tx.productItem.update({
          where: { id: ci.product_itemId },
          data: { quantity_instock: newQty < 0 ? 0 : newQty }
        });
      }

      // clear cart items
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    return res.json({ success: true, order: result });
  } catch (err) {
    console.error("checkoutHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get orders for currently authenticated user
 */
export async function myOrdersHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: {
        orderProducts: {
          include: {
            productItem: { include: { product: true } }
          }
        },
        order_status: true
      }
    });

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("myOrdersHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get a single order (user can view own; admin can view any)
 */
export async function getOrderByIdHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Order id required" });

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderProducts: {
          include: {
            productItem: { include: { product: true, user: { select: { id: true, name: true, avatar: true } } } }
          }
        },
        order_status: true,
        user: { select: { id: true, name: true } }
      }
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // allow admin or owner
    if (req.user.role !== "ADMIN" && order.userId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error("getOrderByIdHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * ADMIN: list all orders
 */
export async function adminListOrdersHandler(req, res) {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const orders = await prisma.order.findMany({
      orderBy: { id: "desc" },
      include: {
        orderProducts: { include: { productItem: { include: { product: true } } } },
        user: { select: { id: true, name: true, email: true } },
        order_status: true
      }
    });

    return res.json({ success: true, orders });
  } catch (err) {
    console.error("adminListOrdersHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * ADMIN: update order status (e.g., PROCESSING, SHIPPED, DELIVERED, CANCELLED)
 * If CANCELLED -> restock productItems.
 */
export async function adminUpdateOrderStatusHandler(req, res) {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const id = Number(req.params.id);
    const { status } = req.body;
    if (!id || !status) return res.status(400).json({ success: false, message: "id and status required" });

    // find or create status row
    let statusRow = await prisma.orderStatus.findFirst({ where: { status } });
    if (!statusRow) {
      statusRow = await prisma.orderStatus.create({ data: { status } });
    }

    // If changing to CANCELLED, we must restock productItems
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderProducts: { include: { productItem: true } }
      }
    });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const prevStatusId = order.order_statusId;

    // Transaction: update status and restock if cancelling
    const updated = await prisma.$transaction(async (tx) => {
      // if cancelling and previously not cancelled -> restock
      if (status.toUpperCase() === "CANCELLED") {
        for (const op of order.orderProducts) {
          await tx.productItem.update({
            where: { id: op.product_itemId },
            data: { quantity_instock: { increment: op.quantity } }
          });
        }
      }

      const upd = await tx.order.update({
        where: { id },
        data: { order_status: { connect: { id: statusRow.id } } },
        include: { orderProducts: { include: { productItem: { include: { product: true } } } }, order_status: true }
      });

      return upd;
    });

    return res.json({ success: true, order: updated });
  } catch (err) {
    console.error("adminUpdateOrderStatusHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
