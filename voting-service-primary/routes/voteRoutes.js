const express = require("express");
const jwt = require("jsonwebtoken");
const Vote = require("../models/Vote");
const Election = require("../models/Election");

const router = express.Router();
const JWT_SECRET = "myjwtsecret";

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
}

router.post("/vote", verifyToken, async (req, res) => {
  try {
    const { candidate } = req.body;
    if (!candidate) return res.status(400).send("Candidate required");

    const userId = req.user.id;

    // prevent double voting
    const existing = await Vote.findOne({ voterId: userId });
    if (existing) return res.status(400).send("User already voted");

    // find active election with the candidate
    const election = await Election.findOne({ isActive: true, "candidates.name": candidate });
    if (!election) return res.status(400).send("Election not active or candidate not found");

    // record vote
    await Vote.create({ voterId: userId, candidate });

    // increment candidate votes
    const cand = election.candidates.find(c => c.name === candidate);
    cand.votes = (cand.votes || 0) + 1;
    await election.save();

    res.send("Vote recorded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Vote failed");
  }
});

module.exports = router;
