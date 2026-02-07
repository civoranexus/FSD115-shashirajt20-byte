import express from "express";
import { verifyToken } from "../utils/token.js";
import { adminListOrdersHandler, adminUpdateOrderStatusHandler, checkoutHandler, getMyOrdersHandler, getOrderByIdHandler,  sellerApproveOrderHandler,  sellerOrdersHandler, verifyPaymentHandler } from "../actions/order.js";
import { allowRoles } from "../utils/role.js";

const routers = express.Router();

routers.post("/checkout", verifyToken, allowRoles("BUYER"), checkoutHandler);
routers.all("/my", verifyToken, allowRoles("BUYER"), getMyOrdersHandler);
routers.get("/:id", verifyToken, allowRoles("BUYER"), getOrderByIdHandler);

routers.get("/admin/all", verifyToken, allowRoles("ADMIN"), adminListOrdersHandler);
routers.post("/admin/:id/status", verifyToken, allowRoles("ADMIN"), adminUpdateOrderStatusHandler);

routers.get("/seller/my-orders", verifyToken, allowRoles("SELLER"), sellerOrdersHandler);

routers.post("/verify-payment", verifyToken, verifyPaymentHandler);

routers.post("/seller/approve/:id", verifyToken, sellerApproveOrderHandler);

export default routers;