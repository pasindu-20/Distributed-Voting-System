const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  }
});

module.exports = mongoose.model("User", UserSchema);
