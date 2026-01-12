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
    <div className="card">
      <h2 className="text-xl font-semibold">Cast Your Vote</h2>

      {error && <p className="error">{error}</p>}

      {elections.length === 0 ? (
        <p>No active elections at the moment.</p>
      ) : (
        elections.map((election) => (
          <div key={election._id} className="mb-5 border rounded p-3 border-gray-200">
            <h3 className="font-medium mb-2">{election.title}</h3>
            <div className="flex flex-wrap gap-3">
              {election.candidates.map((candidate) => (
                <button key={candidate.name} className="btn" onClick={() => vote(election._id, candidate.name)}>
                  Vote for {candidate.name}
                </button>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="mt-4">
        <button className="btn mr-2" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
