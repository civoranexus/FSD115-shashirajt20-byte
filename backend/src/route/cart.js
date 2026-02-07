import express from "express";
import { verifyToken } from "../utils/token.js";
import {
    getCartHandler,
    addToCartHandler,
    updateCartItemHandler,
    removeCartItemHandler,
    clearCartHandler
} from "../actions/action.js";
import { allowRoles } from "../utils/role.js";

const Routers = express.Router();

Routers.get("/cart", verifyToken,  getCartHandler);
Routers.post("/cart/add", verifyToken, allowRoles("BUYER"), addToCartHandler);

Routers.post("/cart/item/:id", verifyToken, allowRoles("BUYER"), updateCartItemHandler);
Routers.delete("/cart/item/:id", verifyToken, allowRoles("BUYER"), removeCartItemHandler);

Routers.delete("/cart/clear", verifyToken, allowRoles("BUYER"), clearCartHandler);

export default Routers;