export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <h3>Access Denied. Please login.</h3>;
  }

  if (role && userRole !== role) {
    return <h3>Unauthorized Access</h3>;
  }

  return children;
}
