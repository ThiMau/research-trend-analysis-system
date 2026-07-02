import { Navigate, useLocation } from "react-router-dom";
import authService from "../Services/authService";

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message:
            "You must be logged in to access this page.",
          from: location.pathname,
        }}
      />
    );
  }

  const role = localStorage.getItem("role");
  if (allowedRoles && !allowedRoles.includes(role)) {
    // If not authorized, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
