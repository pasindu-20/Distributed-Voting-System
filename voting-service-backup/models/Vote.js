const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  candidate: String
});

module.exports = mongoose.model("Vote", VoteSchema);
