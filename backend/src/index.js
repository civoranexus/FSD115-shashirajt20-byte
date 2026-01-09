import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
// import pkg from '@prisma/client';
import router from "../api/user/route";
// const { PrismaClient } = pkg;


const app = express();
const prisma = new PrismaClient();

app.use("/api/user", router);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LiveStockHub API running 🚀");
});

app.listen(5000, () => console.log("Server started on port 5000"));
