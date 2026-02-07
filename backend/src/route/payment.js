import express from "express";
import { verifyToken } from "../utils/token.js";
import { createPaymentOrder, paymentSuccessHandler, verifyPayment } from "../actions/payment.js";

const routerr = express.Router();

routerr.post("/create-order", verifyToken, createPaymentOrder);
routerr.post("/verify", verifyToken, verifyPayment);
routerr.post("/success/:orderId", verifyToken, paymentSuccessHandler);

export default routerr;
