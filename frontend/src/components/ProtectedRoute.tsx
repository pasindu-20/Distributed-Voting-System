import React from "react";

type Props = { children: React.ReactNode; role?: string };

export default function ProtectedRoute({ children, role }: Props) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <h3>Please login</h3>;
  if (role && role !== userRole) return <h3>Unauthorized</h3>;

  return <>{children}</>;
}
