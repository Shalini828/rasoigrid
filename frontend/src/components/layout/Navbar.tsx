import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ShieldCheck, ChevronRight, Sparkles, Navigation } from 'lucide-react';
import { LivePulse } from '../ui/LivePulse';
import { useRescueStore } from '../../stores/useRescueStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const impactMetrics = useRescueStore(state => state.impactMetrics);

  const navLinks = [
    { name: 'The Urban Loop', path: '/' },
    { name: 'Live Command Map', path: '/app/command' },
    { name: 'AI Forecast', path: '/app/forecast' },
    { name: 'Circular Recovery', path: '/app/circular' },
    { name: 'Impact & ESG', path: '/app/impact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070b0f]/80 backdrop-blur-xl">
      {/* Live System Ticker */}
      <div className="hidden md:flex items-center justify-between px-6 py-1 text-xs border-b border-slate-800/50 bg-slate-950/60 font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <LivePulse color="emerald" label="GRID ONLINE" size="sm" />
          <span className="text-slate-300">
            MUMBAI METRO CLUSTER 01
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">
            {impactMetrics?.activeFleetCount || 28} EV RESCUE VANS ACTIVE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400">
            {impactMetrics?.circularDiversionRatePercent || 99.4}% ZERO-LANDFILL DIVERSION
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">AI PREDICTION ENGINE:</span>
          <span className="text-indigo-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> NEURAL-LOGISTICS V3.2
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#070b0f] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white font-mono">
                RASOI<span className="text-emerald-400">GRID</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded font-mono">
                LOOP
              </span>
            </div>
            <p className="text-[10px] tracking-wider uppercase text-slate-400 font-medium">
              Urban Food Rescue Protocol
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <Link
            to="/app/donations"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:bg-slate-700/80 hover:border-slate-600 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Donor Portal</span>
          </Link>
          <Link
            to="/app/command"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all group font-mono"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>OPEN COMMAND</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </header>
  );
};
