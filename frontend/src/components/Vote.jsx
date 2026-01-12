export { default } from './Vote';

  const handleVote = async () => {
    try {
      const res = await vote({ candidate }, token);
      alert(res.data);
    } catch (err) {
      alert(err.response?.data || "Vote failed");
    }
  };

  return (
    <div>
      <h2>Cast Your Vote</h2>
      <input placeholder="Candidate Name" value={candidate} onChange={e => setCandidate(e.target.value)} />
      <button onClick={handleVote}>Vote</button>
    </div>
  );
}
