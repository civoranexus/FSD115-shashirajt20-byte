import express from "express"
import { verifyToken } from "../utils/token";
import { createCatalogProduct, createCattleHandler, createUpdateProductItemHandler } from "../actions/action";

const Router = express.Router();


Router.post("/admin/catalog-product", verifyToken, createCatalogProduct);


Router.post("/seller/product-item", verifyToken, createUpdateProductItemHandler);


Router.post("/seller/cattle", verifyToken, createCattleHandler);

export default Router;