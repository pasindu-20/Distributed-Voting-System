const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PRIMARY = "http://voting-service-primary:5000";
const BACKUP  = "http://voting-service-backup:5000";

let activeServer = PRIMARY;

// 🔁 Health check every 5 seconds
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

// ======================
// ADMIN ROUTES (PROXY)
// ======================

app.use("/admin", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${activeServer}${req.originalUrl}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).send(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Admin service unavailable");
  }
});

// ======================
// VOTING ROUTES (PROXY)
// ======================

app.post("/votes/vote", async (req, res) => {
  try {
    const response = await axios.post(
      `${activeServer}/votes/vote`,
      req.body,
      { headers: req.headers }
    );
    res.send(response.data);
  } catch {
    res.status(500).send("All voting servers are unavailable");
  }
});

// ======================
// WATCHDOG PORT 7000
// ======================

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Watchdog running on port ${PORT}`);
});
