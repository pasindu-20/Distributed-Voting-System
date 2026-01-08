const express = require("express");
const Vote = require("../models/Vote");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const alreadyVoted = await Vote.findOne({ userId: decoded.id });
    if (alreadyVoted) {
      return res.status(403).send("User has already voted");
    }

    const vote = new Vote({
      userId: decoded.id,
      candidate: req.body.candidate
    });

    await vote.save();
    res.send("Vote recorded");

  } catch {
    res.status(401).send("Invalid token");
  }
});

module.exports = router;
