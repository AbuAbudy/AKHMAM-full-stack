import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.isAdmin) {
      return children;
    } else {
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    console.error('Invalid token', error);
    return <Navigate to="/admin/login" replace />;
  }
};

export default AdminRoute;
