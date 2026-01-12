export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <h3>Please login</h3>;
  if (role && role !== userRole) return <h3>Unauthorized</h3>;

  return children;
}
