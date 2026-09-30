import { createElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return createElement(Navigate, { to: "/", replace: true });
  }

  return createElement(Outlet);
}

export default ProtectedRoute;