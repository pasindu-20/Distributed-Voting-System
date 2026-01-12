import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:7000"; // Watchdog

export default function AdminPanel({ setPage }) {
  const [title, setTitle] = useState("");
  const [candidatesInput, setCandidatesInput] = useState("");
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Load all elections
  const loadElections = async () => {
    try {
      const res = await axios.get(`${API}/admin/elections`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setElections(res.data);
    } catch (err) {
      setError("Failed to load elections");
    }
  };

  // Create election + candidates
  const createElection = async () => {
    if (!title) {
      alert("Election title required");
      return;
    }

    try {
      // Create election
      const res = await axios.post(
        `${API}/admin/election`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const electionId = res.data._id;

      // Add candidates
      const candidates = candidatesInput
        .split(",")
        .map(c => c.trim())
        .filter(c => c);

      for (let name of candidates) {
        await axios.post(
          `${API}/admin/election/${electionId}/candidate`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setTitle("");
      setCandidatesInput("");
      loadElections();
    } catch (err) {
      alert("Failed to create election");
    }
  };

  // Add candidate later
  const addCandidate = async (id) => {
    const name = prompt("Candidate name:");
    if (!name) return;

    try {
      await axios.post(
        `${API}/admin/election/${id}/candidate`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadElections();
    } catch {
      alert("Failed to add candidate");
    }
  };

  // Toggle election active/close
  const toggleElection = async (id) => {
    try {
      await axios.put(
        `${API}/admin/election/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadElections();
    } catch {
      alert("Failed to toggle election");
    }
  };

  const logout = () => {
    localStorage.clear();
    setPage("login");
  };

  useEffect(() => {
    loadElections();
  }, []);

  return (
    <div className="card">
      <h2>Admin Panel</h2>

      {error && <p className="error">{error}</p>}

      <input
        placeholder="Election Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Candidates (comma separated)"
        value={candidatesInput}
        onChange={e => setCandidatesInput(e.target.value)}
      />

      <button onClick={createElection}>Create Election</button>

      <hr />

      {elections.length === 0 && <p>No elections yet</p>}

      {elections.map(e => (
        <div key={e._id} style={{ marginBottom: "20px" }}>
          <h4>
            {e.title} —{" "}
            <span style={{ color: e.isActive ? "green" : "red" }}>
              {e.isActive ? "Active" : "Closed"}
            </span>
          </h4>

          <button onClick={() => addCandidate(e._id)}>
            Add Candidate
          </button>

          <button onClick={() => toggleElection(e._id)}>
            Toggle Status
          </button>

          <ul>
            {e.candidates.map((c, i) => (
              <li key={i}>
                {c.name} — {c.votes} votes
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={logout}>Logout</button>
    </div>
  );
}
