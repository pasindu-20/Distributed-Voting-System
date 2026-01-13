import React from "react";
import LogoutButton from "./LogoutButton";

type Props = { setPage: (p: string) => void };

export default function Dashboard({ setPage }: Props) {
  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">CIVIX</h1>
          <p className="text-gray-300">Voting System</p>
        </div>
        <LogoutButton onLogout={() => setPage("login")} />
      </div>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
    </div>
  );
}
