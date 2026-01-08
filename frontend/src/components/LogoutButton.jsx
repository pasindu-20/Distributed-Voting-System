export default function LogoutButton({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    onLogout();
  };

  return (
    <button onClick={handleLogout} style={{ marginBottom: "15px" }}>
      Logout
    </button>
  );
}
