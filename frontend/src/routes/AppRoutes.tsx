import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AppShell } from '../components/layout/AppShell';

// Feature Pages
import { LandingPage } from '../features/landing/LandingPage';
import { DispatchCommandPage } from '../features/dispatch/DispatchCommandPage';
import { ForecastPage } from '../features/prediction/ForecastPage';
import { DonorPortalPage } from '../features/donor/DonorPortalPage';
import { LogisticsFleetPage } from '../features/logistics/LogisticsFleetPage';
import { ReceiverHubPage } from '../features/receiver/ReceiverHubPage';
import { CircularRecoveryPage } from '../features/circular/CircularRecoveryPage';
import { ImpactAnalyticsPage } from '../features/impact/ImpactAnalyticsPage';

// Public Layout Wrapper
const PublicLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#070b0f] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route
          path="/"
          element={
            <PublicLayoutWrapper>
              <LandingPage />
            </PublicLayoutWrapper>
          }
        />

        {/* Command Platform AppShell Layout */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/command" replace />} />
          <Route path="command" element={<DispatchCommandPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="donations" element={<DonorPortalPage />} />
          <Route path="logistics" element={<LogisticsFleetPage />} />
          <Route path="receivers" element={<ReceiverHubPage />} />
          <Route path="circular" element={<CircularRecoveryPage />} />
          <Route path="impact" element={<ImpactAnalyticsPage />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
