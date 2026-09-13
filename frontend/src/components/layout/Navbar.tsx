import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  ChevronRight, 
  Menu, 
  X, 
  Navigation
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  const navLinks = [
    { name: 'Product', href: isLanding ? '#product' : '/#product' },
    { name: 'How It Works', href: isLanding ? '#how-it-works' : '/#how-it-works' },
    { name: 'Impact', href: isLanding ? '#impact' : '/#impact' },
    { name: 'About', href: isLanding ? '#about' : '/#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#070b0f]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#070b0f] rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-xl font-extrabold tracking-tight text-white">
                RASOI<span className="text-emerald-400">GRID</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded font-semibold">
                LOOP
              </span>
            </div>
            <p className="text-[10px] tracking-wider uppercase text-slate-400 font-medium">
              Urban Intelligence Protocol
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/app/donations"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
          >
            Donor Portal
          </Link>
          <Link
            to="/app/command"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all font-mono group"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>LAUNCH APP</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Link
              to="/app/donations"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-200"
            >
              Donor Portal
            </Link>
            <Link
              to="/app/command"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-bold bg-emerald-500 text-slate-950 font-mono flex items-center justify-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>LAUNCH APP</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
