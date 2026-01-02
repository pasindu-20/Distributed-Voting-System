const express = require("express");
const Vote = require("../models/Vote");

const router = express.Router();

// Get final results
router.get("/results", async (req, res) => {
  try {
    const results = await Vote.aggregate([
      { $group: { _id: "$candidate", votes: { $sum: 1 } } }
    ]);

    res.json(results);
  } catch {
    res.status(500).send("Unable to fetch results");
  }
});

module.exports = router;
