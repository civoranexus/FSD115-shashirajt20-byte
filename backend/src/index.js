import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./route/auth.js";
import Router from "./route/product.js";
import CartRouter from "./route/cart.js"
import OrderRouter from "./route/order.js";
import PaymentRouter from "./route/payment.js"
import SellerOrdersRouter from "./route/sellerOrder.js"
import SellerApplicationRouter from "./route/sellerApplication.js"
import AddressRouter from "./route/address.js"

dotenv.config();


const app = express();
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// app.use("/uploads", express.static("uploads"));


app.use("/auth", router);
app.use("/apis", Router);
app.use("/cartapi", CartRouter);
app.use("/orderapi", OrderRouter);

app.use("/paymentapi", PaymentRouter);

app.use("/sellerOrders", SellerOrdersRouter);

app.use("/sellerapplication", SellerApplicationRouter);

app.use("/ad", AddressRouter);

// app.use("/imageapi", uploadRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})