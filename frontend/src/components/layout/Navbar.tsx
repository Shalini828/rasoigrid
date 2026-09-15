import React, { useState } from 'react';

import { Link, useLocation } from 'react-router-dom';

import {
  Activity,
  ChevronRight,
  Menu,
  X,
  Navigation,
  Clock3,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const isLanding = location.pathname === '/';

  const navLinks = [
    {
      name: 'Product',
      href: isLanding ? '#product' : '/#product',
    },
    {
      name: 'How It Works',
      href: isLanding
        ? '#how-it-works'
        : '/#how-it-works',
    },
    {
      name: 'Impact',
      href: isLanding ? '#impact' : '/#impact',
    },
    {
      name: 'About',
      href: isLanding ? '#about' : '/#about',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-[76px] border-b border-slate-800/90 bg-[#070b0f] text-slate-100">

      <div className="h-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* BRAND */}

        <Link
          to="/"
          className="flex items-center gap-3 min-w-fit group"
        >

          <div className="w-9 h-9 rounded-lg border border-emerald-500/50 bg-emerald-500/10 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.12)]">

            <Activity className="w-[18px] h-[18px] text-emerald-400" />

          </div>

          <div className="leading-none">

            <div className="flex items-center gap-2">

              <span className="font-mono text-[17px] font-bold tracking-tight text-slate-100">
                RASOI
                <span className="text-emerald-400">
                  GRID
                </span>
              </span>

              <span className="px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[9px] font-mono font-bold tracking-wider text-emerald-400">
                OPS
              </span>

            </div>

            <p className="mt-1 text-[9px] uppercase tracking-[0.16em] font-mono text-slate-500">
              Urban Intelligence Protocol
            </p>

          </div>

        </Link>


        {/* TELEMETRY */}

        <div className="hidden lg:flex items-center gap-3 ml-8 mr-auto">

          <div className="w-px h-5 bg-slate-800" />

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/5">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />

            </span>

            <span className="text-[10px] font-mono font-bold tracking-[0.12em] text-emerald-400">
              TELEMETRY SYNC
            </span>

          </div>

          <span className="text-slate-700">
            •
          </span>

          <div className="flex items-center gap-1.5 text-slate-500">

            <Clock3 className="w-3.5 h-3.5" />

            <span className="text-[10px] font-mono tracking-wider">
              LIVE
            </span>

          </div>

        </div>


        {/* DESKTOP NAVIGATION */}

        <nav className="hidden xl:flex items-center gap-7 mr-8">

          {navLinks.map((link) => (

            <a
              key={link.name}
              href={link.href}
              className="text-[12px] font-medium text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {link.name}
            </a>

          ))}

        </nav>


        {/* DESKTOP ACTIONS */}

        <div className="hidden md:flex items-center gap-2">

          {/* DONOR PORTAL */}

          <Link
            to="/app/donations"
            className="px-3 py-2 text-[11px] font-mono font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
          >
            DONOR PORTAL
          </Link>


          {/* LAUNCH APP */}

          <Link
            to="/app/command"
            className="ml-1 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-400/30 bg-emerald-500 text-[11px] font-mono font-bold tracking-wide text-slate-950 hover:bg-emerald-400 transition-all shadow-[0_0_18px_rgba(16,185,129,0.18)]"
          >

            <Navigation className="w-3.5 h-3.5" />

            <span>
              LAUNCH APP
            </span>

            <ChevronRight className="w-3.5 h-3.5" />

          </Link>

        </div>


        {/* MOBILE BUTTON */}

        <button
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="md:hidden p-2.5 rounded-lg border border-slate-800 bg-[#0b1117] text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
          aria-label="Toggle Navigation Menu"
        >

          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}

        </button>

      </div>


      {/* MOBILE MENU */}

      {mobileMenuOpen && (

        <div className="md:hidden border-t border-slate-800 bg-[#070b0f] px-5 py-5 shadow-2xl">

          <nav className="flex flex-col gap-1">

            {navLinks.map((link) => (

              <a
                key={link.name}
                href={link.href}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="px-3 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-emerald-500/5 hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </a>

            ))}

          </nav>


          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">

            {/* DONOR PORTAL */}

            <Link
              to="/app/donations"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="w-full rounded-lg border border-slate-800 bg-[#0b1117] px-4 py-3 text-center text-[11px] font-mono font-bold text-slate-300"
            >
              DONOR PORTAL
            </Link>


            {/* LAUNCH APP */}

            <Link
              to="/app/command"
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-center text-[11px] font-mono font-bold text-slate-950 flex items-center justify-center gap-2"
            >

              <Navigation className="w-3.5 h-3.5" />

              LAUNCH APP

              <ChevronRight className="w-3.5 h-3.5" />

            </Link>

          </div>

        </div>

      )}

    </header>
  );
};