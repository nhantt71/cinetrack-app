import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "@/services/AuthService";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!AuthService.isAuthenticated()) {
    // Optional: clear invalid token if expired
    if (AuthService.isTokenExpired()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
}


