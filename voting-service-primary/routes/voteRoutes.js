const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = "myjwtsecret";

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
}

router.post("/vote", verifyToken, (req, res) => {
  const { candidate } = req.body;

  if (!candidate) {
    return res.status(400).send("Candidate required");
  }

  console.log("Vote received for:", candidate);
  res.send("Vote recorded successfully");
});

module.exports = router;
