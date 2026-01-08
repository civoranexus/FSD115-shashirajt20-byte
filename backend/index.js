import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import pool from "./database/mysql.js"
import router from "./api/user/route.js";

const app = express();

app.use("/api/user",router);
app.use(cors());
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("Backend server is running");
});

app.get("/api/test-database", async (req, res) =>{
    try {
    const [rows] = await pool.query("SELECT 1");
    res.json({
      success: true,
      message: "Database is working",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database query failed",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
