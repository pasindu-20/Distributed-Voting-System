import React, { useState, FormEvent } from "react";
import axios from "axios";

type LoginProps = { setPage: (p: string) => void };

const API = "http://localhost:4000";

export default function Login({ setPage }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent) => {
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
    <form className="card max-w-md mx-auto" onSubmit={handleLogin}>
      <h2 className="text-2xl font-semibold mb-4">Login</h2>

      {error && <p className="error mb-2">{error}</p>}

      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
        required
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        required
      />

      <button className="btn mt-2" type="submit">Login</button>

      <p className="link mt-4 cursor-pointer text-sm text-center" onClick={() => setPage("register")}>Don't have an account? Register</p>
    </form>
  );
}
