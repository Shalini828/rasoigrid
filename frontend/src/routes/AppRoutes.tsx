import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AppShell } from '../components/layout/AppShell';

import { LandingPage } from '../features/landing/LandingPage';
import { DispatchCommandPage } from '../features/dispatch/DispatchCommandPage';
import { ForecastPage } from '../features/prediction/ForecastPage';
import { DonorPortalPage } from '../features/donor/DonorPortalPage';
import { LogisticsFleetPage } from '../features/logistics/LogisticsFleetPage';
import { ReceiverHubPage } from '../features/receiver/ReceiverHubPage';
import { CircularRecoveryPage } from '../features/circular/CircularRecoveryPage';
import { ImpactAnalyticsPage } from '../features/impact/ImpactAnalyticsPage';

import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';

import { ProtectedRoute } from './ProtectedRoute';


const PublicLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <main className="min-h-screen">
      {children}
    </main>
  </div>
);


export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Home */}
        <Route
          path="/"
          element={
            <PublicLayoutWrapper>
              <LandingPage />
            </PublicLayoutWrapper>
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Protected Application */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/app"
            element={<AppShell />}
          >
            <Route
              index
              element={
                <Navigate
                  to="/app/command"
                  replace
                />
              }
            />

            <Route
              path="command"
              element={<DispatchCommandPage />}
            />

            <Route
              path="forecast"
              element={<ForecastPage />}
            />

            <Route
              path="donations"
              element={<DonorPortalPage />}
            />

            <Route
              path="logistics"
              element={<LogisticsFleetPage />}
            />

            <Route
              path="receivers"
              element={<ReceiverHubPage />}
            />

            <Route
              path="circular"
              element={<CircularRecoveryPage />}
            />

            <Route
              path="impact"
              element={<ImpactAnalyticsPage />}
            />
          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};