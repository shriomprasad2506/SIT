import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';

const PrivateRoute = ({ element }) => {
  const isLoggedIn = !!sessionStorage.getItem('authToken'); // Check if the user is logged in
  return isLoggedIn ? (
    <AdminLayout>{element}</AdminLayout>
  ) : (
    <Navigate to="/login" /> // If not logged in, redirect to login page
  );
};

export default PrivateRoute;
