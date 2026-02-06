import express from "express";
import { verifyToken } from "../utils/token.js";
import { createPaymentOrder, paymentSuccessHandler, verifyPayment } from "../actions/payment.js";

const router = express.Router();

router.post("/create-order", verifyToken, createPaymentOrder);
router.post("/verify", verifyToken, verifyPayment);
router.post("/success/:orderId", verifyToken, paymentSuccessHandler);

export default router;
