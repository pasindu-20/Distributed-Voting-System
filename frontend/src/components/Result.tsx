import React, { useEffect, useState } from "react";
import { getResults } from "../services/api";

type ResultItem = { _id: string; votes: number };

export default function Result() {
  const [results, setResults] = useState<ResultItem[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await getResults();
      setResults(res.data);
    };
    fetchResults();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Voting Results</h2>
      <ul className="list-disc pl-5">
        {results.map(r => (
          <li key={r._id}>{r._id}: {r.votes} votes</li>
        ))}
      </ul>
    </div>
  );
}
