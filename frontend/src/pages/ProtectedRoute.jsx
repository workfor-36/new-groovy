import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Get token and role from cookies
  const role = Cookies.get("role"); // 'Cashier', 'Manager', etc.
  const cashierToken = Cookies.get("cashier_token");
  const managerToken = Cookies.get("manager_token");

  // Validate based on token + role
  const isAuthenticated =
    (role === "Cashier" && cashierToken) ||
    (role === "Manager" && managerToken);

  // If not authenticated or role not allowed
  if (!isAuthenticated || !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
