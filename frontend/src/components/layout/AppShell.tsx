import React, { useEffect, useState } from 'react';

import { Link, useLocation, Outlet } from 'react-router-dom';

import {
  Activity,
  MapPin,
  TrendingUp,
  Building2,
  Truck,
  HeartHandshake,
  Recycle,
  BarChart3,
  Bell,
  PlusCircle,
  Clock,
  Radio,
} from 'lucide-react';

import { LivePulse } from '../ui/LivePulse';
import { useRescueStore } from '../../stores/useRescueStore';

export const AppShell: React.FC = () => {
  const location = useLocation();

  const {
    surplusList,
    missionsList,
    fetchInitialData,
    liveSimulationActive,
    toggleSimulation,
  } = useRescueStore();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    fetchInitialData();

    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [fetchInitialData]);

  const urgentCount = surplusList.filter(
    (s) =>
      s.priority === 'critical' &&
      s.status === 'available'
  ).length;

  const activeMissionsCount = missionsList.filter(
    (m) =>
      m.status === 'in_transit' ||
      m.status === 'dispatching'
  ).length;

  const navItems = [
    {
      label: 'Live Operations Map',
      path: '/app/command',
      icon: MapPin,
      badge:
        activeMissionsCount > 0
          ? activeMissionsCount
          : undefined,
    },
    {
      label: 'AI Prediction Matrix',
      path: '/app/forecast',
      icon: TrendingUp,
    },
    {
      label: 'Donor Intake Terminal',
      path: '/app/donations',
      icon: Building2,
      badge:
        urgentCount > 0
          ? `${urgentCount} Urgent`
          : undefined,
      badgeColor:
        'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      label: 'Fleet Route Optimizer',
      path: '/app/logistics',
      icon: Truck,
    },
    {
      label: 'Receiver & Shelter Hub',
      path: '/app/receivers',
      icon: HeartHandshake,
    },
    {
      label: 'Circular Bio-Loop',
      path: '/app/circular',
      icon: Recycle,
    },
    {
      label: 'Impact & ESG Ledger',
      path: '/app/impact',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#16304f] flex flex-col font-sans">

      {/* =====================================================
          TOP APPLICATION NAVBAR
      ===================================================== */}

      <header className="h-[64px] shrink-0 bg-white border-b border-slate-200 sticky top-0 z-50 shadow-[0_1px_8px_rgba(15,23,42,0.04)]">

        <div className="h-full px-4 sm:px-5 lg:px-6 flex items-center justify-between">

          {/* BRAND */}
          <div className="flex items-center min-w-0">

            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              {/* Logo */}
              <div className="w-9 h-9 rounded-[10px] bg-emerald-50 border border-emerald-200 flex items-center justify-center transition-all group-hover:bg-emerald-100 group-hover:border-emerald-300">
                <Activity className="w-[18px] h-[18px] text-emerald-600 group-hover:scale-110 transition-transform" />
              </div>

              {/* Wordmark */}
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-bold tracking-tight text-[#16304f]">
                  RASOI<span className="text-emerald-600">GRID</span>
                </span>

                <span className="px-1.5 py-[3px] rounded-md border border-emerald-200 bg-emerald-50 text-[9px] font-mono font-bold tracking-[0.12em] text-emerald-600">
                  OPS
                </span>
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block h-7 w-px bg-slate-200 mx-5" />

            {/* TELEMETRY */}
            <div className="hidden md:flex items-center gap-3">

              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    liveSimulationActive
                      ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.45)]'
                      : 'bg-amber-500'
                  }`}
                />

                <span className="text-[9px] font-mono font-bold tracking-[0.13em] text-emerald-700">
                  {liveSimulationActive
                    ? 'TELEMETRY SYNC'
                    : 'PAUSED'}
                </span>
              </div>

              <span className="text-slate-300">
                •
              </span>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />

                <span className="text-[10px] font-mono tracking-wider text-slate-500">
                  {currentTime || '15:45:00'} IST
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">

            {/* LIVE STREAM */}
            <button
              onClick={toggleSimulation}
              className={`hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[9px] font-mono font-bold tracking-[0.12em] transition-all ${
                liveSimulationActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
              }`}
              title="Toggle simulated event streamer"
            >
              <Radio className="w-3.5 h-3.5" />

              <span>
                {liveSimulationActive
                  ? 'LIVE STREAM: ON'
                  : 'LIVE STREAM: OFF'}
              </span>
            </button>

            {/* LOG SURPLUS */}
            <Link
              to="/app/donations"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_4px_12px_rgba(16,185,129,0.18)] transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />

              <span className="text-[9px] font-mono font-bold tracking-[0.12em]">
                LOG SURPLUS
              </span>
            </Link>

            {/* NOTIFICATIONS */}
            <button
              className="relative p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />

              {urgentCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full">
                  <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          APPLICATION BODY
      ===================================================== */}

      <div className="flex-1 flex min-h-0">

        {/* =================================================
            LIGHT SIDEBAR
        ================================================= */}

        <aside className="hidden md:flex w-[260px] shrink-0 flex-col justify-between bg-white border-r border-slate-200">

          {/* NAVIGATION */}
          <div className="flex-1 p-3">

            {/* SECTION HEADER */}
            <div className="px-3 pt-3 pb-4">

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-500 font-bold">
                  Mission Control
                </span>

                <span className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="mt-2 text-[8px] font-mono uppercase tracking-[0.16em] text-slate-400">
                Urban Recovery Network
              </div>
            </div>

            {/* NAV ITEMS */}
            <nav className="space-y-1">

              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path;

                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      group relative flex items-center justify-between
                      min-h-[46px]
                      px-3.5
                      rounded-[10px]
                      border
                      transition-all duration-200
                      ${
                        isActive
                          ? `
                            bg-emerald-50
                            border-emerald-200
                            text-emerald-700
                          `
                          : `
                            border-transparent
                            text-slate-500
                            hover:bg-slate-50
                            hover:border-slate-200
                            hover:text-slate-800
                          `
                      }
                    `}
                  >

                    {/* ACTIVE INDICATOR */}
                    {isActive && (
                      <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-emerald-500" />
                    )}

                    {/* ICON + LABEL */}
                    <div className="flex items-center gap-3 min-w-0">

                      <div
                        className={`
                          w-7 h-7 rounded-md flex items-center justify-center shrink-0
                          ${
                            isActive
                              ? 'bg-white border border-emerald-100'
                              : 'bg-slate-50 border border-slate-100 group-hover:bg-white'
                          }
                        `}
                      >
                        <Icon
                          className={`
                            w-[15px] h-[15px]
                            transition-colors
                            ${
                              isActive
                                ? 'text-emerald-600'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }
                          `}
                        />
                      </div>

                      <span
                        className={`
                          text-[11px] leading-tight
                          ${
                            isActive
                              ? 'font-semibold text-emerald-700'
                              : 'font-medium text-slate-600 group-hover:text-slate-800'
                          }
                        `}
                      >
                        {item.label}
                      </span>
                    </div>

                    {/* BADGE */}
                    {item.badge && (
                      <span
                        className={`
                          ml-2 shrink-0
                          text-[8px]
                          px-1.5
                          py-1
                          rounded-md
                          border
                          font-mono
                          font-bold
                          tracking-wide
                          ${
                            item.badgeColor ||
                            'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* NETWORK STATUS */}
            <div className="mt-6 mx-2 h-px bg-slate-200" />

            <div className="mt-5 px-3">

              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-slate-400">
                  Network Status
                </span>
              </div>

              <div className="space-y-2.5">

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400">
                    ACTIVE NODES
                  </span>

                  <span className="text-[10px] font-mono font-bold text-emerald-600">
                    142
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400">
                    DONORS
                  </span>

                  <span className="text-[10px] font-mono font-bold text-slate-700">
                    142
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-400">
                    ZERO-WASTE
                  </span>

                  <span className="text-[10px] font-mono font-bold text-cyan-600">
                    99.4%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR FOOTER */}
          <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-4">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-[8px] font-mono uppercase tracking-[0.16em] text-slate-400">
                  RasoiGrid
                </div>

                <div className="mt-1 text-[9px] font-mono text-slate-500">
                  Recovery Protocol
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                <span className="text-[8px] font-mono uppercase tracking-wider text-emerald-600">
                  Online
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto bg-[#f5f8f5] p-3 sm:p-4 lg:p-5">

          <Outlet />

        </main>
      </div>
    </div>
  );
};

export default AppShell;