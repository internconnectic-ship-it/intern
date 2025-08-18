require('dotenv').config();
const mysql = require('mysql2');

// 🔎 Debug: เช็คว่าอ่านค่า .env ได้มั้ย
console.log("DB Config:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "****" : "MISSING",
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL');
});

module.exports = db;
