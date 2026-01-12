import React from "react";

type Props = { onLogout: () => void };

export default function LogoutButton({ onLogout }: Props) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    onLogout();
  };

  return (
    <button className="btn mb-4" onClick={handleLogout}>Logout</button>
  );
}
