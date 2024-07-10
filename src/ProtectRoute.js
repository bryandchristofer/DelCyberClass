import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const userRole = localStorage.getItem("role");

  if (!allowedRoles.includes(userRole)) {
    // Redirect mereka ke halaman login, dengan state `from` agar bisa redirect kembali setelah login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectRoute;
