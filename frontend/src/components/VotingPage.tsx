import React, { useEffect, useState } from "react";
import axios from "axios";

type Candidate = { name: string; votes?: number };
type Election = { _id: string; title: string; candidates: Candidate[] };

type Props = { setPage: (p: string) => void };

const API = "http://localhost:7000"; // Watchdog ONLY

export default function VotingPage({ setPage }: Props) {
  const [elections, setElections] = useState<Election[]>([]);
  const [error, setError] = useState("");

  // Load active elections
  useEffect(() => {
    const loadElections = async () => {
      try {
        const res = await axios.get(`${API}/votes/elections`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setElections(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load elections");
      }
    };
    loadElections();
  }, []);

  const vote = async (electionId: string, candidate: string) => {
    const confirmVote = window.confirm(`Are you sure you want to vote for ${candidate}?`);

    if (!confirmVote) return;

    try {
      await axios.post(
        `${API}/votes/vote`,
        { candidate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Vote submitted successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data || "Voting failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    setPage("login");
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">CIVIX</h1>
          <p className="text-gray-300">Voting System</p>
        </div>
        <button className="btn" onClick={logout}>Logout</button>
      </div>

      <h2 className="text-3xl font-semibold mb-6">Cast Your Vote</h2>

      {error && <p className="error mb-6">{error}</p>}

      {elections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">No active elections at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {elections.map((election) => (
            <div key={election._id} className="rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <h3 className="text-xl font-semibold mb-4 text-cyan-300">{election.title}</h3>
              <div className="flex flex-wrap gap-3">
                {election.candidates.map((candidate) => (
                  <button 
                    key={candidate.name} 
                    className="btn" 
                    onClick={() => vote(election._id, candidate.name)}
                  >
                    Vote for {candidate.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
