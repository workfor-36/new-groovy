import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminProtectedRoute = ({ children }) => {
  const token = Cookies.get("admin_token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;
