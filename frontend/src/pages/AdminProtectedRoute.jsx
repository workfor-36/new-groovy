import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AdminProtectedRoute = ({ children }) => {
  const token = Cookies.get("admin_token");

  if (!token) {
    toast.error("Please login as admin");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;
