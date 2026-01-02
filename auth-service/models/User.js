const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["ADMIN", "VOTER"] },
  hasVoted: { type: Boolean, default: false }
});

module.exports = mongoose.model("User", userSchema);
