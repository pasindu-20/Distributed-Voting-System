import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Vote from "./components/Vote";
import Result from "./components/Result";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  if (!token) return <Login setToken={setToken} setRole={setRole} />;

  return (
    <Router>
      <Routes>
        {role === "ADMIN" && <Route path="/" element={<AdminPanel />} />}
        {role === "VOTER" && <Route path="/" element={<Vote token={token} />} />}
        <Route path="/results" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
