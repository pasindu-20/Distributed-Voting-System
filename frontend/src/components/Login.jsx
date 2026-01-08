import { useState } from "react";
import { login } from "../services/api";
import Register from "./Register";

export default function Login({ setToken, setRole }) {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (showRegister) {
    return <Register goToLogin={() => setShowRegister(false)} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password });
      setToken(res.data.token);
      const payload = JSON.parse(atob(res.data.token.split(".")[1]));
      setRole(payload.role);
    } catch {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      <p>
        Don’t have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setShowRegister(true)}>
          Register
        </span>
      </p>
    </form>
  );
}
