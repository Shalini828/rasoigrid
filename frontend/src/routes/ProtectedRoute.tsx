import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { UserRole } from "../stores/useAuthStore";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const getRoleHome = (role: UserRole): string => {
  switch (role) {
    case "DONOR":
      return "/app/donations";

    case "NGO":
      return "/app/command";

    case "VOLUNTEER":
      return "/app/logistics";

    case "ADMIN":
      return "/app/command";

    default:
      return "/login";
  }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const user = useAuthStore((state) => state.user);

  const location = useLocation();

  /*
   * User is not logged in
   */
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
   * User is logged in but does not have
   * permission for this section.
   */
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  /*
   * User has permission.
   */
  return <Outlet />;
};
