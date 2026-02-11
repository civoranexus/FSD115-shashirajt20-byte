import express from "express"
import { verifyToken } from "../utils/token.js";
import { approveListingHandler, approveSellerHandler, createCatalogProduct, createCattleHandler, createUpdateProductItemHandler, getActiveProductItems, getActiveProductItemsByProductId, getBreeds, getCategories, getMilkcapacities, getPendingListings, getPendingSellers, getProductById, getProducts, getSellerListingByProductId, getSellerListings, rejectListingHandler } from "../actions/action.js";

const Router = express.Router();


Router.post("/admin/catalog-product", verifyToken, createCatalogProduct);
Router.post("/seller/product-item", verifyToken, createUpdateProductItemHandler);
Router.post("/seller/cattle", verifyToken, createCattleHandler);

Router.get("/categories", getCategories);
Router.get("/breeds", getBreeds);
Router.get("/milkcapacities", getMilkcapacities);

Router.get("/products", getProducts);

Router.get("/seller/my-listings", verifyToken, getSellerListings);

Router.get("/seller/my-listings/:productId", verifyToken, getSellerListingByProductId);

Router.get("/admin/sellers/pending", verifyToken, getPendingSellers);
Router.post("/admin/sellers/:id/approve", verifyToken, approveSellerHandler);

Router.get("/admin/listings/pending", verifyToken, getPendingListings);
Router.post("/admin/listings/:id/approve", verifyToken, approveListingHandler);
Router.post("/admin/listings/:id/reject", verifyToken, rejectListingHandler);

Router.get("/products/items/active", getActiveProductItems);

Router.get("/products/:id", getProductById);
Router.get("/product-items/product/:id", getActiveProductItemsByProductId);



export default Router;