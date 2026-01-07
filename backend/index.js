const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req, res)=>{
    res.send("Backend server is running");
});

const pool = require("./database/mysql");

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

// app.get("/test-database", async (req, res)=>{
//     try {
//         const [rows] = await pool.query("SELECT 1");
//         res.send("MySQL connected successfully");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("MySQL connection failed");
//     }
// });