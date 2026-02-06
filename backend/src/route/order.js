import express from "express";
import { verifyToken } from "../utils/token.js";
import { adminListOrdersHandler, adminUpdateOrderStatusHandler, checkoutHandler, getMyOrdersHandler, getOrderByIdHandler,  sellerOrdersHandler, verifyPaymentHandler } from "../actions/order.js";
import { allowRoles } from "../utils/role.js";

const routers = express.Router();

routers.post("/checkout", verifyToken, allowRoles("BUYER"), checkoutHandler);
routers.all("/my", verifyToken, allowRoles("BUYER"), getMyOrdersHandler);
routers.get("/:id", verifyToken, allowRoles("BUYER"), getOrderByIdHandler);

routers.get("/admin/all", verifyToken, allowRoles("ADMIN"), adminListOrdersHandler);
routers.post("/admin/:id/status", verifyToken, allowRoles("ADMIN"), adminUpdateOrderStatusHandler);

routers.get("/seller/my-orders", verifyToken, allowRoles("SELLER"), sellerOrdersHandler);

router.post("/verify-payment", verifyToken, verifyPaymentHandler);

export default routers;