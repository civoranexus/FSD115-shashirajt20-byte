import express from "express";
import { verifyToken } from "../utils/token.js";
import { getAddressesHandler, addAddressHandler, removeAddressHandler } from "../actions/address.js";

const router = express.Router();

router.get("/addresses", verifyToken, getAddressesHandler);
router.post("/addresses", verifyToken, addAddressHandler);
router.delete("/addresses/:id", verifyToken, removeAddressHandler);

export default router;
