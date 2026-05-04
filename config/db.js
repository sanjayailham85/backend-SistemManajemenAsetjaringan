const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
  connectTimeout: 10000,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL Connected");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL Connection Error:", err);
  });

module.exports = pool;
