import LogoutButton from "./LogoutButton";

export default function Dashboard({ setPage }) {
  return (
    <div className="card">
      <LogoutButton onLogout={() => setPage("login")} />
      <h2>Dashboard</h2>
    </div>
  );
}
