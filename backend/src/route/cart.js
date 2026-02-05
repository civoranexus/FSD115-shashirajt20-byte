import express from "express";
import { verifyToken } from "../utils/token.js";
import {
    getCartHandler,
    addToCartHandler,
    updateCartItemHandler,
    removeCartItemHandler,
    clearCartHandler
} from "../actions/action.js";

const Routers = express.Router();

Routers.get("/cart", verifyToken, getCartHandler);
Routers.post("/cart/add", verifyToken, addToCartHandler);

Routers.post("/cart/item/:id", verifyToken, updateCartItemHandler);
Routers.delete("/cart/item/:id", verifyToken, removeCartItemHandler);

Routers.delete("/cart/clear", verifyToken, clearCartHandler);

export default Routers;