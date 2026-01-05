const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host : process.env.localhost,
    user : process.env.root,
    password : process.env.root,
    database : process.env.livestockhub,
});

module.exports = pool;