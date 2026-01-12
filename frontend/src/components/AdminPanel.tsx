import React, { useEffect, useState } from "react";
import axios from "axios";

type Candidate = { name: string; votes?: number };
type Election = { _id: string; title: string; isActive?: boolean; candidates: Candidate[] };

type AdminPanelProps = { setPage: (p: string) => void };

const API = "http://localhost:7000"; // Watchdog

export default function AdminPanel({ setPage }: AdminPanelProps) {
  const [title, setTitle] = useState("");
  const [candidatesInput, setCandidatesInput] = useState("");
  const [elections, setElections] = useState<Election[]>([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || "";

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
        .map((c: string) => c.trim())
        .filter((c: string) => c);

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
  const addCandidate = async (id: string) => {
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
  const toggleElection = async (id: string) => {
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
      <h2 className="text-xl font-semibold">Admin Panel</h2>

      {error && <p className="error">{error}</p>}

      <input className="input" placeholder="Election Title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />

      <input className="input" placeholder="Candidates (comma separated)" value={candidatesInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCandidatesInput(e.target.value)} />

      <button className="btn mt-2" onClick={createElection}>Create Election</button>

      <hr className="my-4" />

      {elections.length === 0 && <p>No elections yet</p>}

      {elections.map(e => (
        <div key={e._id} className="mb-5">
          <h4 className="font-medium">
            {e.title} — <span className={`${e.isActive ? 'text-green-600' : 'text-red-600'}`}>{e.isActive ? 'Active' : 'Closed'}</span>
          </h4>

          <div className="flex gap-2 my-2">
            <button className="btn" onClick={() => addCandidate(e._id)}>Add Candidate</button>
            <button className="btn" onClick={() => toggleElection(e._id)}>Toggle Status</button>
          </div>

          <ul className="list-disc pl-5">
            {e.candidates.map((c, i) => (
              <li key={i}>{c.name} — {c.votes} votes</li>
            ))}
          </ul>
        </div>
      ))}

      <button className="btn mt-4" onClick={logout}>Logout</button>
    </div>
  );
}
