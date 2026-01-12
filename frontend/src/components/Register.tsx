import React, { useState, FormEvent } from "react";
import axios from "axios";

type RegisterProps = { setPage: (p: string) => void };
const API = "http://localhost:4000";

export default function Register({ setPage }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.length < 4) {
      return setError("Username must be at least 4 characters");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      await axios.post(`${API}/auth/register`, {
        username,
        password,
        role,
        adminSecret: role === "ADMIN" ? adminSecret : undefined,
      });

      alert("Registration successful. Please login.");
      setPage("login");
    } catch (err: any) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <form className="card max-w-md mx-auto" onSubmit={handleRegister}>
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      {error && <p className="error mb-2">{error}</p>}

      <input className="input" placeholder="Username" value={username} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} required />

      <input className="input" type="password" placeholder="Password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />

      <select className="input" value={role} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as "USER" | "ADMIN") }>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      {role === "ADMIN" && (
        <input className="input" placeholder="Admin Secret" value={adminSecret} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminSecret(e.target.value)} />
      )}

      <button className="btn mt-2" type="submit">Register</button>

      <p onClick={() => setPage("login")} className="link mt-4 cursor-pointer text-sm text-center">Already have an account? Login</p>
    </form>
  );
}
