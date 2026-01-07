const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

});

// pool.getConnection((err, connection)=> {
//     if(err){
//         console.log("mysql connection failed");
//         console.log(err.message);
//     }else{
//         console.log("mysql connected successfully");
//         connection.release();
//     }
// });

module.exports = pool;