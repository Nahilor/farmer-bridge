// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { api } from '../../services/api';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = api.isAuthenticated();
  const userRole = api.getUserRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User doesn't have permission, redirect to their appropriate dashboard
    switch(userRole) {
      case 'FARMER':
        return <Navigate to="/farmer/dashboard" replace />;
      case 'RETAILER':
        return <Navigate to="/retailer/dashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;