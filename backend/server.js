require("dotenv").config();
// Serve static folders
const express = require("express"); // Import the Express library (a toolkit for building web servers in Node.js)
const app = express(); // Create a new Express app (our website/server)
// Import the CORS library to allow cross-origin requests (requests from other websites)
const cors = require("cors");
const db = require("./config/db");
const path = require("path");

app.use(
  "/events",
  express.static("D:/Gallery-Event-Management/events") // full absolute path
);
app.use("/documents", express.static("D:/Gallery-Event-Management/documents"));
app.use("/history", express.static("D:/Gallery-Event-Management/history"));

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const usersRoutes = require("./routes/users");
const contactRoutes = require("./routes/contact");
const registerRoutes = require("./routes/registerRoutes");
const historyRoutes = require("./routes/historyRoutes");
const reverseGeo = require("./routes/reverseGeo");
const aiRoutes = require("./routes/aiRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/reverse-geo", reverseGeo);

const PORT = process.env.PORT;
// Setup database tables route
app.get('/setup-database', async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id int UNSIGNED NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        email varchar(100) NOT NULL,
        password varchar(255) NOT NULL,
        role enum('user','admin','root') DEFAULT 'user',
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        last_login datetime DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id int NOT NULL AUTO_INCREMENT,
        title varchar(255) DEFAULT NULL,
        category varchar(50) NOT NULL,
        description text,
        date date DEFAULT NULL,
        author varchar(255) DEFAULT NULL,
        venue varchar(200) DEFAULT NULL,
        image varchar(200) DEFAULT NULL,
        fees int DEFAULT NULL,
        contact varchar(15) NOT NULL,
        required_documents text,
        users int UNSIGNED NOT NULL,
        latitude varchar(255) DEFAULT NULL,
        longitude varchar(255) DEFAULT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id int NOT NULL AUTO_INCREMENT,
        name varchar(100) DEFAULT NULL,
        email varchar(100) DEFAULT NULL,
        event_id int DEFAULT NULL,
        registered_at datetime DEFAULT CURRENT_TIMESTAMP,
        documents text,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS history (
        id int NOT NULL AUTO_INCREMENT,
        event_id int NOT NULL,
        summary text,
        highlights text,
        attendees_count int DEFAULT NULL,
        guests varchar(255) DEFAULT NULL,
        budget_spent decimal(10,2) DEFAULT NULL,
        long_summary varchar(100) DEFAULT NULL,
        lessons_learned text,
        media_links text,
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    res.json({ message: 'Database tables created successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
