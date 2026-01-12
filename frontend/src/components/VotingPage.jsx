import axios from "axios";

const API = "http://localhost:7000"; // ✅ Watchdog ONLY

export default function VotingPage({ setPage }) {

  const vote = async (candidate) => {
    const confirmVote = window.confirm(
      `Are you sure you want to vote for ${candidate}?`
    );

    if (!confirmVote) return;

    try {
      await axios.post(
  "http://localhost:7000/votes/vote",
  { choice },
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

      <button onClick={() => vote("Candidate A")}>
        Vote Candidate A
      </button>

      <button onClick={() => vote("Candidate B")}>
        Vote Candidate B
      </button>

      <br /><br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}
