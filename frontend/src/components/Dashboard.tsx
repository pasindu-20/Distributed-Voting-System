import React from "react";
import LogoutButton from "./LogoutButton";

type Props = { setPage: (p: string) => void };

export default function Dashboard({ setPage }: Props) {
  return (
    <div className="card">
      <LogoutButton onLogout={() => setPage("login")} />
      <h2 className="text-xl font-semibold">Dashboard</h2>
    </div>
  );
}
