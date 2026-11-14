
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../api/axios";

// ====================
// Protected Route
// ====================

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      const token =
        localStorage.getItem("hishabio-token") ||
        sessionStorage.getItem("hishabio-token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        localStorage.removeItem("hishabio-token");
        localStorage.removeItem("hishabio-user");

        sessionStorage.removeItem("hishabio-token");
        sessionStorage.removeItem("hishabio-user");

        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted">Verifying your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
