// src/route/sellerApplication.js
import express from "express";
import { verifyToken } from "../utils/token.js";
import {
  applySellerHandler,
  getMySellerApplication,
  getPendingSellerApplications,
  approveSellerApplication,
  rejectSellerApplication
} from "../actions/sellerApplication.js";

const router = express.Router();

// buyer -> apply
router.post("/sellers/apply", verifyToken, applySellerHandler);
router.get("/sellers/my-application", verifyToken, getMySellerApplication);

// admin -> manage
router.get("/admin/sellers-applications", verifyToken, getPendingSellerApplications);
router.post("/admin/sellers-applications/:id/approve", verifyToken, approveSellerApplication);
router.post("/admin/sellers-applications/:id/reject", verifyToken, rejectSellerApplication);

export default router;
