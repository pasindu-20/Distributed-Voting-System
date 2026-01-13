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
    <div className="card max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">CIVIX</h1>
        <p className="text-gray-300">Voting System</p>
      </div>
      <h2 className="text-3xl font-semibold mb-6">Voting Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No results available yet.</p>
      ) : (
        <div className="space-y-4">
          {results.map(r => (
            <div 
              key={r._id} 
              className="rounded-xl p-4 backdrop-blur-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-cyan-300">{r._id}</span>
                <span className="text-xl font-bold text-purple-300">{r.votes} votes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
