const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

mongoose.connect("mongodb://mongo:27017/voting");

app.listen(4000, () => {
  console.log("Auth Service running on port 4000");
});
