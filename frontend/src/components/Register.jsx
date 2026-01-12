export { default } from './Register';

  const handleRegister = async (e) => {
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
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <form className="card" onSubmit={handleRegister}>
      <h2>Register</h2>

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

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>

      {role === "ADMIN" && (
        <input
          placeholder="Admin Secret"
          value={adminSecret}
          onChange={(e) => setAdminSecret(e.target.value)}
        />
      )}

      <button type="submit">Register</button>

      <p onClick={() => setPage("login")} className="link">
        Already have an account? Login
      </p>
    </form>
  );
}
