import { Navigate, useLocation } from "react-router-dom";
import authService from "../Services/authService";

function ProtectedRoute({ children }) {
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

  return children;
}

export default ProtectedRoute;
