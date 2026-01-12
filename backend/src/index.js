// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./modules/auth/route.js"

// app.use("/api/auth", authRoutes);

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("LiveStockHub Backend Running...");
// });

// app.listen(8000, () => console.log("Server running on 8000"));


import express from "express"
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors({
  origin : "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);


app.listen(8000, () => {
  console.log("Server is running");
});


