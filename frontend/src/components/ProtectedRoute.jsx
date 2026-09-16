import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ accessToken, authLoading, children }) {
  if (authLoading) {
    return <p>Loading...</p>;
  }

  if (!accessToken) {
    return <Navigate to="/register" replace />;
  }

  return children;
}
