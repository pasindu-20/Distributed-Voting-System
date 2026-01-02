const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  voterId: String,
  candidate: String
});

module.exports = mongoose.model("Vote", voteSchema);
