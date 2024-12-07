const express = require("express");
const mysql = require("mysql2");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// AWS Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection on server start
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Failed to connect to AWS RDS Database:", err.message);
    process.exit(1); // Exit process if DB isn't connected
  } else {
    console.log("Successfully connected to AWS RDS.");
    connection.release();
  }
});

// CRUD Routes

/** CREATE: Add a user */
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  // Validate inputs
  if (!name || !email) {
    return res.status(400).send({ error: "Both name and email are required" });
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";

  pool.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error("Insert failed:", err.message);
      return res.status(500).send({ error: "Failed to insert data into DB" });
    }
    res.status(201).send({ id: result.insertId, name, email });
  });
});

/** READ: Get all users */
app.get("/users", async (req, res) => {
  const sql = "SELECT * FROM users";
  pool.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving users:", err.message);
      return res.status(500).send({ error: "Failed to retrieve users" });
    }
    res.send(results);
  });
});

/** UPDATE: Modify user by id */
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send({ error: "Both name and email are required" });
  }

  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";

  pool.query(sql, [name, email, id], (err) => {
    if (err) {
      console.error("Update failed:", err.message);
      return res.status(500).send({ error: "Failed to update user data" });
    }

    res.send({ id, name, email });
  });
});

/** DELETE: Remove user by id */
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";

  pool.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting user:", err.message);
      return res.status(500).send({ error: "Failed to delete user" });
    }
    res.send({ success: true });
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


