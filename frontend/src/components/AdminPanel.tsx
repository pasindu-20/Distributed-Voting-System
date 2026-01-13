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
    <div className="card max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">CIVIX</h1>
          <p className="text-gray-300">Voting System</p>
        </div>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      <h2 className="text-3xl font-semibold mb-6">Admin Panel</h2>

      {error && <p className="error mb-6">{error}</p>}

      <div className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">Create New Election</h3>
        <input className="input" placeholder="Election Title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />

        <input className="input" placeholder="Candidates (comma separated)" value={candidatesInput} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCandidatesInput(e.target.value)} />

        <button className="btn mt-4 w-full" onClick={createElection}>Create Election</button>
      </div>

      <div className="border-t border-white/10 my-8"></div>

      <h3 className="text-2xl font-semibold mb-6">Existing Elections</h3>

      {elections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-xl">No elections yet</p>
        </div>
      )}

      <div className="space-y-6">
        {elections.map(e => (
          <div key={e._id} className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-cyan-300">
                {e.title}
              </h4>
              <span className={`px-4 py-2 rounded-lg font-medium ${
                e.isActive 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {e.isActive ? 'Active' : 'Closed'}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 my-4">
              <button className="btn" onClick={() => addCandidate(e._id)}>Add Candidate</button>
              <button className="btn" onClick={() => toggleElection(e._id)}>Toggle Status</button>
            </div>

            {e.candidates.length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-medium text-gray-400 mb-2">Candidates:</h5>
                {e.candidates.map((c, i) => (
                  <div key={i} className="rounded-xl p-3 backdrop-blur-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <span className="text-cyan-300">{c.name}</span>
                    <span className="text-purple-300 font-semibold">{c.votes || 0} votes</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
