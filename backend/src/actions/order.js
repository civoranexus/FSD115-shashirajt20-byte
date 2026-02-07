import prisma from "../lib/prisma.js";

async function getOrderStatusId(statusString) {
  let s = await prisma.orderStatus.findFirst({ where: { status: statusString } });
  if (!s) {
    s = await prisma.orderStatus.create({ data: { status: statusString } });
  }
  return s.id;
}


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

export async function sellerApproveOrderHandler(req, res) {
  try {
    const sellerId = req.user?.id;
    if (!sellerId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const orderId = Number(req.params.id);

    // find order with products
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          include: { productItem: true }
        }
      }
    });

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    // check seller owns at least one item in this order
    const sellerItem = order.orderProducts.find(
      op => op.productItem.userId === sellerId
    );

    if (!sellerItem)
      return res.status(403).json({ success: false, message: "Not your order" });

    // get CONFIRMED status id
    const confirmedStatus = await prisma.orderStatus.findFirst({
      where: { status: "CONFIRMED" }
    });

    // update order status
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { order_status: { connect: { id: confirmedStatus.id } } }
    });

    return res.json({ success: true, order: updated });

  } catch (err) {
    console.error("sellerApproveOrder error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
