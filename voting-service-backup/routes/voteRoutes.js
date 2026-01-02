const express = require("express");
const Vote = require("../models/Vote");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/vote", auth, async (req, res) => {
  try {
    if (req.user.role !== "VOTER") {
      return res.status(403).send("Only voters can vote");
    }

    const vote = new Vote({
      voterId: req.user.id,
      candidate: req.body.candidate
    });

    await vote.save();
    res.send("Vote cast successfully");

  } catch (err) {
    if (err.code === 11000) {
      res.status(409).send("You have already voted");
    } else {
      res.status(500).send("Voting service error");
    }
  }
});

module.exports = router;
