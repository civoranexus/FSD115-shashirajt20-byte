import express from "express";
import { verifyToken } from "../utils/token.js";
import {
  getSellerPendingOrderProducts,
  approveOrderProductHandler,
  rejectOrderProductHandler,
} from "../actions/sellerOrder.js";

const router = express.Router();

// GET pending order items for this seller
router.get("/pending", verifyToken, getSellerPendingOrderProducts);

// POST approve a single orderProduct
router.post("/:id/approve", verifyToken, approveOrderProductHandler);

// POST reject a single orderProduct
router.post("/:id/reject", verifyToken, rejectOrderProductHandler);

export default router;
