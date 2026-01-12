import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:7000"; // ✅ Watchdog ONLY

export default function VotingPage({ setPage }) {
  const [elections, setElections] = useState([]);
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

  const vote = async (electionId, candidate) => {
    const confirmVote = window.confirm(
      `Are you sure you want to vote for ${candidate}?`
    );

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
    } catch (err) {
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
      <h2>Cast Your Vote</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {elections.length === 0 ? (
        <p>No active elections at the moment.</p>
      ) : (
        elections.map((election) => (
          <div key={election._id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
            <h3>{election.title}</h3>
            {election.candidates.map((candidate) => (
              <button
                key={candidate.name}
                onClick={() => vote(election._id, candidate.name)}
                style={{ margin: "5px", padding: "10px" }}
              >
                Vote for {candidate.name}
              </button>
            ))}
          </div>
        ))
      )}

      <br /><br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}
