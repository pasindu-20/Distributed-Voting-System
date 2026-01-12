const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const voteRoutes = require("./routes/voteRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminOnly = require("./middleware/adminOnly");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://mongo:27017/voting");

const JWT_SECRET = "myjwtsecret";

// 🔐 JWT middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// Protected voting routes
app.use("/votes", auth, voteRoutes);

// Admin routes
app.use("/admin", auth, adminOnly, adminRoutes);

// Health check for watchdog
app.get("/health", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Voting Service running on port ${PORT}`);
});
