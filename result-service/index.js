const express = require("express");
const mongoose = require("mongoose");
const resultRoutes = require("./routes/resultRoutes");

const app = express();
app.use("/api", resultRoutes);

mongoose.connect("mongodb://mongo:27017/voting");

app.listen(7000, () => {
  console.log("Result Service running on port 7000");
});
