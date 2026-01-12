const express = require("express");
const jwt = require("jsonwebtoken");
const Election = require("../models/Election");

const router = express.Router();
const JWT_SECRET = "myjwtsecret";

// 🔐 Admin auth middleware
function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "ADMIN") {
      return res.status(403).send("Admin only");
    }
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// GET all elections
router.get("/elections", adminAuth, async (req, res) => {
  const elections = await Election.find();
  res.json(elections);
});

// CREATE election
router.post("/election", adminAuth, async (req, res) => {
  const election = await Election.create({
    title: req.body.title,
    candidates: []
  });
  res.json(election);
});

// ADD candidate
router.post("/election/:id/candidate", adminAuth, async (req, res) => {
  const election = await Election.findById(req.params.id);
  election.candidates.push({ name: req.body.name });
  await election.save();
  res.send("Candidate added");
});

// TOGGLE election
router.put("/election/:id/toggle", adminAuth, async (req, res) => {
  const election = await Election.findById(req.params.id);
  election.isActive = !election.isActive;
  await election.save();
  res.send("Election updated");
});

module.exports = router;
