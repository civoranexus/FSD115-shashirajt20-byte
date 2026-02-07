import prisma from "../lib/prisma.js";
import razorpay from "../lib/razorpay.js";
import crypto from "crypto";

export async function createPaymentOrder(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false });

    const { orderId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const razorpayOrder = await razorpay.orders.create({
      amount: order.order_total * 100, // paise
      currency: "INR",
      receipt: `order_${order.id}`,
    });

    return res.json({
      success: true,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("createPaymentOrder error", err);
    res.status(500).json({ success: false });
  }
}



export async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (sign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { order_status: { connect: { status: "CONFIRMED" } } },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("verifyPayment error", err);
    res.status(500).json({ success: false });
  }
}



export async function paymentSuccessHandler(req, res) {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        order_status: {
          connect: { status: "CONFIRMED" }
        },
        payments: {
          create: {
            amount: 0, // later real gateway amount
            status: "PAID"
          }
        }
      },
      include: { order_status: true }
    });

    return res.json({ success: true, order });

  } catch (err) {
    console.error("paymentSuccess error", err);
    return res.status(500).json({ success: false });
  }
}
