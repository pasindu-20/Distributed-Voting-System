import React, { useState } from "react";
import { vote } from "../services/api";

type Props = { token?: string };

export default function Vote({ token }: Props) {
  const [candidate, setCandidate] = useState("");

  const handleVote = async () => {
    try {
      const res = await vote({ candidate }, token || "");
      alert(res.data);
    } catch (err: any) {
      alert(err.response?.data || "Vote failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Cast Your Vote</h2>
      <input className="input" placeholder="Candidate Name" value={candidate} onChange={e => setCandidate(e.target.value)} />
      <button className="btn mt-2" onClick={handleVote}>Vote</button>
    </div>
  );
}
