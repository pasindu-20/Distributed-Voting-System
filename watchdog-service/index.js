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
    // Forward only necessary headers (Authorization) to avoid forwarding host/content-length etc.
    const headers = {};
    if (req.headers.authorization) headers.Authorization = req.headers.authorization;

    const response = await axios({
      method: req.method,
      url: `${activeServer}${req.originalUrl}`,
      data: req.body,
      headers,
      timeout: 5000,
    });

    res.status(response.status).send(response.data);
  } catch (err) {
    console.error("Admin proxy error:", err.message);
    if (err.response) {
      return res.status(err.response.status).send(err.response.data);
    }
    res.status(500).send("Admin service unavailable");
  }
});

// ======================
// VOTING ROUTES (PROXY)
// ======================

app.get("/votes/elections", async (req, res) => {
  try {
    const response = await axios.get(
      `${activeServer}/votes/elections`,
      { headers: req.headers }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Elections proxy error:", err.message);
    if (err.response) {
      return res.status(err.response.status).send(err.response.data);
    }
    res.status(500).send("All voting servers are unavailable");
  }
});

app.post("/votes/vote", async (req, res) => {
  try {
    const response = await axios.post(
      `${activeServer}/votes/vote`,
      req.body,
      { headers: req.headers }
    );
    res.send(response.data);
  } catch (err) {
    console.error("Voting proxy error:", err.message);
    // If the upstream voting service responded, forward its status and body.
    if (err.response) {
      return res.status(err.response.status).send(err.response.data);
    }
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
