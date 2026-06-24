import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait until auth check finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not logged in → send to login, remember where they tried to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Logged in but not admin → send to home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin + logged in → show the page
  return children;
};

export default AdminRoute;
