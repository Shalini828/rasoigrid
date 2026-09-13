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
  Radio
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
    toggleSimulation 
  } = useRescueStore();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    fetchInitialData();
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchInitialData]);

  const urgentCount = surplusList.filter(s => s.priority === 'critical' && s.status === 'available').length;
  const activeMissionsCount = missionsList.filter(m => m.status === 'in_transit' || m.status === 'dispatching').length;

  const navItems = [
    { label: 'Live Operations Map', path: '/app/command', icon: MapPin, badge: activeMissionsCount > 0 ? activeMissionsCount : undefined },
    { label: 'AI Prediction Matrix', path: '/app/forecast', icon: TrendingUp },
    { label: 'Donor Intake Terminal', path: '/app/donations', icon: Building2, badge: urgentCount > 0 ? `${urgentCount} Urgent` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { label: 'Fleet Route Optimizer', path: '/app/logistics', icon: Truck },
    { label: 'Receiver & Shelter Hub', path: '/app/receivers', icon: HeartHandshake },
    { label: 'Circular Bio-Loop', path: '/app/circular', icon: Recycle },
    { label: 'Impact & ESG Ledger', path: '/app/impact', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#070b0f] text-slate-100 flex flex-col font-sans">
      {/* Top Telemetry Header */}
      <header className="h-14 border-b border-slate-800/80 bg-[#090e14] px-4 flex items-center justify-between z-40 sticky top-0 backdrop-blur-md">
        {/* Left branding */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-base font-bold text-white tracking-tight">
                RASOI<span className="text-emerald-400">GRID</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                OPS
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs font-mono text-slate-400">
            <LivePulse color={liveSimulationActive ? 'emerald' : 'amber'} label={liveSimulationActive ? 'TELEMETRY SYNC' : 'PAUSED'} size="sm" />
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {currentTime || '15:45:00'} IST
            </span>
          </div>
        </div>

        {/* Right action tools */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSimulation}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              liveSimulationActive
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle simulated event streamer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{liveSimulationActive ? 'Live Stream: ON' : 'Live Stream: OFF'}</span>
          </button>

          <Link
            to="/app/donations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] font-mono transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>LOG SURPLUS</span>
          </Link>

          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors relative">
            <Bell className="w-4 h-4" />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#090e14]/90 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Mission Control
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold border ${item.badgeColor || 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick Hub Status Footer in Sidebar */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Grid Health
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Active Nodes:</span>
                <span className="text-emerald-400 font-semibold">142 Donors</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Zero-Waste Rate:</span>
                <span className="text-cyan-400 font-semibold">99.4%</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto bg-[#070b0f] p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
