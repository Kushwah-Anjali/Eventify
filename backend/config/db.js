const mysql = require("mysql2");
const db = mysql
  .createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "event_management",
  })
  .promise();
db.connect()
  .then(() => console.log("MySQL Connected Successfully!"))
  .catch((err) => console.error("MySQL Connection Failed:", err.message));
module.exports = db;
