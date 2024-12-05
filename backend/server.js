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

// Create a connection pool for better scalability
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // RDS endpoint
  user: process.env.DB_USER,       // Master username
  password: process.env.DB_PASS,   // Master password
  database: process.env.DB_NAME,   // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to AWS RDS!");
    connection.release(); // Release the connection back to the pool
  }
});

// CRUD API Endpoints

// Create
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send({ error: "Name and email are required." });
  }
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  pool.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).send({ error: err.message });
    res.status(201).send({ id: result.insertId, name, email });
  });
});

// Read
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  pool.query(sql, (err, results) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send(results);
  });
});

// Update
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send({ error: "Name and email are required." });
  }
  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  pool.query(sql, [name, email, id], (err) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({ id, name, email });
  });
});

// Delete
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  pool.query(sql, [id], (err) => {
    if (err) return res.status(500).send({ error: err.message });
    res.send({ success: true });
  });
});

// Start the server
const PORT = process.env.PORT || 5001; // Use PORT from .env if available
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

