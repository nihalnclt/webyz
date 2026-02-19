import { type JSX } from "react";
import { Navigate } from "react-router";
import useUserStore from "../hooks/useUserStore";
import { getDefaultPath } from "./Router";
import type { Role } from "../types";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = useUserStore((s) => s.token);
  const user = useUserStore((s) => s.user);

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as Role)) {
    const defaultPath = getDefaultPath(user.role as Role);
    return <Navigate to={defaultPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
