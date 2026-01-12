import { useState } from "react";
import axios from "axios";

const API = "http://localhost:4000";

export default function Login({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API}/auth/login`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "ADMIN") {
        setPage("admin");
      } else {
        setPage("vote");
      }
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <form className="card" onSubmit={handleLogin}>
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      {/* ✅ REGISTER LINK */}
      <p className="link" onClick={() => setPage("register")}>
        Don't have an account? Register
      </p>
    </form>
  );
}
