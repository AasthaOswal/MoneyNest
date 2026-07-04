import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        Loading...
      </div>
    );
  }

  if (!user) {
    console.log("User is not logged in. From ProtectedRoute.jsx");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  const allowedPaths = [
    "/profile",
    "/family/setup",
    "/family/create",
    "/family/join",
  ];

  // Admin can access everything without a family
  const isAdmin = user.role === "admin";

  if(user.role === "admin"){
    return <Outlet/>
  }

  if (
    !isAdmin &&
    ["member", "familyAdmin"].includes(user.role) &&
    !user.familyId &&
    !allowedPaths.includes(location.pathname)
  ) {
    toast.error(
      "Please create or join a family first to access this page.",
      { id: "family-required" }
    );

    return <Navigate to="/family/setup" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("User is not authorized");
    toast.error("You don't have permission to access this page.", {
      id: "permission-required",
    });
    return <Navigate to="/dashboard/family" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;