import { createElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getSavedData } from "../services/localstorageSevice";

function ProtectedRoute() {
  const user = getSavedData();

  if (!user) {
    return createElement(Navigate, { to: "/login", replace: true });
  }

  return createElement(Outlet);
}

export default ProtectedRoute;