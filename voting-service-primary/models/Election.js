const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: String,
  votes: { type: Number, default: 0 }
});

const ElectionSchema = new mongoose.Schema({
  title: String,
  candidates: [CandidateSchema],
  isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model("Election", ElectionSchema);
