const express = require("express");
const mongoose = require("mongoose");
const voteRoutes = require("./routes/voteRoutes");

const app = express();
app.use(express.json());

app.use("/votes", voteRoutes);

// Health check endpoint (for Watchdog)
app.get("/health", (req, res) => {
  res.send("OK");
});

mongoose.connect("mongodb://mongo:27017/voting");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Voting Service running on port ${PORT}`);
});
