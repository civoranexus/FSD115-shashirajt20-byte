import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./route/auth.js";
import Router from "./route/product.js";

dotenv.config();


const app = express();
app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", router);
app.use("/api", Router);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on ${process.env.PORT}`)
})