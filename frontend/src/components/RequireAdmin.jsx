import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { isAdminRole } from "../utils/auth";
import "../assets/css/admin/admin_style.css";

const RequireAdmin = ({ children, isCheckingSession }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isCheckingSession) {
    return <div className="admin-loading">Dang tai phien dang nhap...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdminRole(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default RequireAdmin;
