import axios from "axios";

export default function VotingPage() {

  const vote = async (candidate) => {
    const confirmVote = window.confirm(
      `Are you sure you want to vote for ${candidate}?`
    );

    if (!confirmVote) return;

    try {
      await axios.post(
        "http://localhost:5000/vote",
        { candidate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      alert("Vote submitted successfully");
    } catch {
      alert("Voting failed");
    }
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
    </div>
  );
}
