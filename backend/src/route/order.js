import express from "express";
import { verifyToken } from "../utils/token.js";
import { checkoutHandler, myOrdersHandler } from "../actions/order.js";

const routers = express.Router();

routers.post("/checkout", verifyToken, checkoutHandler);
routers.all("/my", verifyToken, myOrdersHandler);
routers.get("/:id", verifyToken, getOrderByIdHandler);

// admin routes
routers.get("/admin/all", verifyToken, adminListOrdersHandler);
routers.post("/admin/:id/status", verifyToken, adminUpdateOrderStatusHandler);

export default routers;