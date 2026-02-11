import prisma from "../lib/prisma.js";

/**
 * Get pending order items that belong to this seller (productItem.userId === sellerId)
 * Returns orderProducts where the parent order has status 'PENDING'
 */
export async function getSellerPendingOrderProducts(req, res) {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user.role !== "SELLER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Seller role required" });
    }

    const items = await prisma.orderProduct.findMany({
      where: {
        productItem: { userId: sellerId },
        order: { order_status: { status: "PENDING" } }, // expects OrderStatus row with status "PENDING"
      },
      orderBy: { id: "desc" },
      include: {
        order: { include: { order_status: true, user: true } },
        productItem: { include: { product: true } },
        user: true, // buyer who ordered (user field on OrderProduct)
      },
    });

    return res.json({ success: true, items });
  } catch (err) {
    console.error("getSellerPendingOrderProducts error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Approve an orderProduct by id (seller action).
 * Effect: set parent order.order_status => "CONFIRMED"
 */
export async function approveOrderProductHandler(req, res) {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user.role !== "SELLER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Seller role required" });
    }

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "id required" });

    const op = await prisma.orderProduct.findUnique({
      where: { id },
      include: { productItem: true, order: true },
    });
    if (!op) return res.status(404).json({ success: false, message: "Order item not found" });

    // verify seller owns the productItem
    if (op.productItem.userId !== sellerId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // ensure OrderStatus 'CONFIRMED' exists (create if missing)
    let statusRow = await prisma.orderStatus.findFirst({ where: { status: "CONFIRMED" } });
    if (!statusRow) {
      statusRow = await prisma.orderStatus.create({ data: { status: "CONFIRMED" } });
    }

    // update parent order to CONFIRMED
    const updatedOrder = await prisma.order.update({
      where: { id: op.orderId },
      data: { order_status: { connect: { id: statusRow.id } } },
      include: { orderProducts: true, order_status: true },
    });

    return res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("approveOrderProductHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Reject an orderProduct by id (seller action).
 * Effect: set parent order.order_status => "CANCELLED"
 * Optionally accept a reason in body.reason
 */
export async function rejectOrderProductHandler(req, res) {
  try {
    const sellerId = req.user?.id;
    if (!sellerId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (req.user.role !== "SELLER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Seller role required" });
    }

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "id required" });

    const { reason } = req.body;

    const op = await prisma.orderProduct.findUnique({
      where: { id },
      include: { productItem: true, order: true },
    });
    if (!op) return res.status(404).json({ success: false, message: "Order item not found" });
    if (op.productItem.userId !== sellerId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // ensure CANCELLED status
    let statusRow = await prisma.orderStatus.findFirst({ where: { status: "CANCELLED" } });
    if (!statusRow) {
      statusRow = await prisma.orderStatus.create({ data: { status: "CANCELLED" } });
    }

    // update parent order status
    const updatedOrder = await prisma.order.update({
      where: { id: op.orderId },
      data: { order_status: { connect: { id: statusRow.id } } },
      include: { orderProducts: true, order_status: true },
    });

    // optionally: save reject reason somewhere (we don't have a field on OrderProduct or Order for it)
    // You may want to add a `seller_reject_reason` on OrderProduct in the schema for traceability.

    return res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("rejectOrderProductHandler error", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
