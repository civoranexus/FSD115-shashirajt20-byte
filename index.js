const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("LiveStockHub Backend is not Running now");
});

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});


const pool = require("./db/mysql");

app.get("/test-db", async (req, res)=>{
    try{
        const [rows] = await pool.query("SELECT 1");
        res.send("MySQL Connected Successfully");
    }catch(err){
        console.error(err);
        res.status(500).send("MySQL connection is failed");
    }
});