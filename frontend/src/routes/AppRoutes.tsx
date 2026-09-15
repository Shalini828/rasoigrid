import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { LandingPage } from "../features/landing/LandingPage";
import { DispatchCommandPage } from "../features/dispatch/DispatchCommandPage";
import { ForecastPage } from "../features/prediction/ForecastPage";
import { DonorPortalPage } from "../features/donor/DonorPortalPage";
import { DonorDashboardPage } from "../features/donor/DonorDashboardPage";
import { DonorHistoryPage } from "../features/donor/DonorHistoryPage";
import { LogisticsFleetPage } from "../features/logistics/LogisticsFleetPage";
import { ReceiverHubPage } from "../features/receiver/ReceiverHubPage";
import { CircularRecoveryPage } from "../features/circular/CircularRecoveryPage";
import { ImpactAnalyticsPage } from "../features/impact/ImpactAnalyticsPage";
import { NGODashboardPage } from "../features/ngo/NGODashboardPage";
import { AdminDashboardPage } from "../features/admin/AdminDashboardPage";
import { AdminUsersPage } from "../features/admin/AdminUsersPage";
import { AdminNGOVerificationPage } from "../features/admin/AdminNGOVerificationPage";
import { AdminAuditPage } from "../features/admin/AdminAuditPage";
import { AdminNetworkMonitoringPage } from "../features/admin/AdminNetworkMonitoringPage";
import { AdminImpactPage } from "../features/admin/AdminImpactPage";

import { LoginPage } from "../features/auth/LoginPage";

import { RegisterPage } from "../features/auth/RegisterPage";

import { ProtectedRoute } from "./ProtectedRoute";

import { useAuthStore } from "../stores/useAuthStore";

import type { UserRole } from "../stores/useAuthStore";

const RoleHomeRedirect: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role: UserRole = user.role;

  switch (role) {
    case "DONOR":
      return <Navigate to="/app/donor/dashboard" replace />;

    case "NGO":
      return <Navigate to="/app/ngo/dashboard" replace />;

    case "VOLUNTEER":
      return <Navigate to="/app/logistics" replace />;

    case "ADMIN":
      return <Navigate to="/app/admin/dashboard" replace />;

    default:
      return <Navigate to="/login" replace />;
  }
};

const PublicLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <main className="min-h-screen">{children}</main>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}

        <Route
          path="/"
          element={
            <PublicLayoutWrapper>
              <LandingPage />
            </PublicLayoutWrapper>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* PROTECTED APPLICATION */}

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppShell />}>
            {/* ROLE-AWARE DEFAULT */}

            <Route index element={<RoleHomeRedirect />} />

            {/* NGO */}

            <Route element={<ProtectedRoute allowedRoles={["NGO", "ADMIN"]} />}>
              <Route path="ngo/dashboard" element={<NGODashboardPage />} />
              <Route path="command" element={<DispatchCommandPage />} />

              <Route path="forecast" element={<ForecastPage />} />

              <Route path="receivers" element={<ReceiverHubPage />} />

              <Route path="circular" element={<CircularRecoveryPage />} />

              <Route path="impact" element={<ImpactAnalyticsPage />} />
            </Route>

            {/* ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                <Route
                  path="admin/dashboard"
                  element={<AdminDashboardPage />}
                />

                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route
                  path="admin/ngos"
                  element={<AdminNGOVerificationPage />}
                />
                <Route
                  path="admin/network"
                  element={<AdminNetworkMonitoringPage />}
                />
                <Route path="admin/audit" element={<AdminAuditPage />} />
                <Route path="admin/impact" element={<AdminImpactPage />} />
              </Route>
            </Route>

            {/* DONOR */}

            <Route element={<ProtectedRoute allowedRoles={["DONOR"]} />}>
              <Route path="donor/dashboard" element={<DonorDashboardPage />} />

              <Route path="donor/history" element={<DonorHistoryPage />} />

              <Route path="donations" element={<DonorPortalPage />} />
            </Route>

            {/* VOLUNTEER */}

            <Route
              element={<ProtectedRoute allowedRoles={["VOLUNTEER", "ADMIN"]} />}
            >
              <Route path="logistics" element={<LogisticsFleetPage />} />
            </Route>
          </Route>
        </Route>

        {/* FALLBACK */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
