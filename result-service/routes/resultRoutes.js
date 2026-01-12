const express = require("express");
const Vote = require("../models/Vote");

const router = express.Router();

router.get("/", async (req, res) => {
  const results = await Vote.aggregate([
    { $group: { _id: "$candidate", count: { $sum: 1 } } }
  ]);

  res.json(results);
});

module.exports = router;
