const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sanjaya85",
  database: "assetmanagement",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
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
