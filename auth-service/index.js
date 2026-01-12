const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://mongo:27017/voting");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" }
});

const User = mongoose.model("User", UserSchema);

const ADMIN_SECRET = "admin123"; // 🔐 use same everywhere
const JWT_SECRET = "myjwtsecret";


// ✅ REGISTER
app.post("/auth/register", async (req, res) => {
  try {
    const { username, password, role, adminSecret } = req.body;

    if (username.length < 4 || password.length < 6) {
      return res.status(400).send("Invalid input");
    }

    if (role === "ADMIN" && adminSecret !== ADMIN_SECRET) {
      return res.status(403).send("Invalid admin secret");
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: hashed,
      role: role === "ADMIN" ? "ADMIN" : "USER"
    });

    res.send("Registered successfully");
  } catch (err) {
    res.status(400).send("User already exists");
  }
});


// ✅ LOGIN
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).send("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).send("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET
  );

  res.json({ token, role: user.role });
});


app.listen(4000, () => console.log("Auth service running on 4000"));
