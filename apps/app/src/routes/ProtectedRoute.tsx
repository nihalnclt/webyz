import { Navigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";

export default function ProtectedRoute({ children }: any) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
