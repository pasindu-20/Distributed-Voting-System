export { default } from './Result';

  useEffect(() => {
    const fetchResults = async () => {
      const res = await getResults();
      setResults(res.data);
    };
    fetchResults();
  }, []);

  return (
    <div>
      <h2>Voting Results</h2>
      <ul>
        {results.map(r => (
          <li key={r._id}>{r._id}: {r.votes} votes</li>
        ))}
      </ul>
    </div>
  );
}
