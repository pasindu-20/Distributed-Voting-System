const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PRIMARY = "http://voting-primary:5000";
const BACKUP = "http://voting-backup:5000";

let activeServer = PRIMARY;

// Health check every 5 seconds
setInterval(async () => {
  try {
    await axios.get(`${PRIMARY}/health`, { timeout: 2000 });
    activeServer = PRIMARY;
    console.log("Primary server is alive");
  } catch {
    activeServer = BACKUP;
    console.log("Primary down. Switched to backup");
  }
}, 5000);

// Proxy vote requests
app.post("/votes/vote", async (req, res) => {
  try {
    const response = await axios.post(
      `${activeServer}/votes/vote`,
      req.body,
      { headers: req.headers }
    );
    res.send(response.data);
  } catch (err) {
    res.status(500).send("All voting servers are unavailable");
  }
});

app.listen(6000, () => {
  console.log("Watchdog running on port 6000");
});
