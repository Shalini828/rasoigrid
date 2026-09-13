import React from 'react';
import { Activity, ShieldCheck, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05080c] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white font-mono">
              RASOI<span className="text-emerald-400">GRID</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            The intelligent urban food loop. Unifying surplus prediction, cold-chain routing, and circular biological recovery to eliminate municipal food landfilling.
          </p>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Predictive Dispatch v3.2</span>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono">
            Platform Hubs
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/app/command" className="hover:text-emerald-400 transition-colors">
                Live Dispatch Map
              </Link>
            </li>
            <li>
              <Link to="/app/forecast" className="hover:text-emerald-400 transition-colors">
                AI Surplus Forecasting
              </Link>
            </li>
            <li>
              <Link to="/app/donations" className="hover:text-emerald-400 transition-colors">
                Commercial Donor Terminal
              </Link>
            </li>
            <li>
              <Link to="/app/logistics" className="hover:text-emerald-400 transition-colors">
                Cold-Chain Fleet Logistics
              </Link>
            </li>
            <li>
              <Link to="/app/receivers" className="hover:text-emerald-400 transition-colors">
                Shelter & Kitchen Intake
              </Link>
            </li>
          </ul>
        </div>

        {/* The Food Loop Cascade */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono">
            Hierarchy of Recovery
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5 text-emerald-400">
              <Heart className="w-3.5 h-3.5" />
              <span>1. People First (Nutritious Meals)</span>
            </li>
            <li className="flex items-center gap-1.5 text-amber-400">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>2. Circular Bio-Upcycling</span>
            </li>
            <li className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              <span>3. Biogas & Clean Cogeneration</span>
            </li>
            <li className="flex items-center gap-1.5 text-rose-400 line-through">
              <span>4. Landfill (Eliminated)</span>
            </li>
          </ul>
        </div>

        {/* Security & ESG */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono">
            Verification & ESG
          </h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>FSSAI Safe Food Handover Standard</span>
            </li>
            <li>
              <Link to="/app/impact" className="hover:text-emerald-400 transition-colors">
                Methane & Carbon Avoidance Ledger
              </Link>
            </li>
            <li>
              <span className="text-slate-400">ISO 14064 GHG Audit Compliant</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© {new Date().getFullYear()} RasoiGrid Foundation. Built for sustainable zero-waste megacities.</p>
        <p className="font-mono text-[11px] text-slate-400 mt-2 sm:mt-0">
          PREDICT → ROUTE → RECOVER
        </p>
      </div>
    </footer>
  );
};
