const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { username, password, role, adminSecret } = req.body;

    // 🔎 Input validation
    if (!username || username.length < 4) {
      return res.status(400).send("Username must be at least 4 characters");
    }

    if (!password || password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }

    // 🔒 Restrict ADMIN registration
    if (role === "ADMIN") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).send("Unauthorized ADMIN registration");
      }
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      role: role || "VOTER"
    });

    await user.save();
    res.send("User registered successfully");

  } catch (err) {
    res.status(500).send("Registration failed");
  }
});

module.exports = router;


/* LOGIN */
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(401).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(401).send("Invalid password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "SECRET_KEY"
  );

  res.json({ token });
});

module.exports = router;
