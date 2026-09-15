import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  LockKeyhole,
  Mail,
  HeartHandshake,
  UtensilsCrossed,
} from 'lucide-react';

import { useAuthStore } from '../../stores/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /*
   * =========================================================
   * ROLE-BASED DESTINATION
   * =========================================================
   *
   * DONOR     -> Donor Portal
   * NGO       -> NGO Command Center
   * VOLUNTEER -> Volunteer Logistics
   * ADMIN     -> Mission Control
   */
  const getRoleBasedRoute = () => {
    try {
      const storedUser = localStorage.getItem('rasoigrid_user');

      if (!storedUser) {
        return '/app/command';
      }

      const user = JSON.parse(storedUser);

      switch (user.role) {
        case 'DONOR':
          return '/app/donations';

        case 'NGO':
          return '/app/command';

        case 'VOLUNTEER':
          return '/app/logistics';

        case 'ADMIN':
          return '/app/command';

        default:
          return '/app/command';
      }
    } catch {
      return '/app/command';
    }
  };

  /*
   * =========================================================
   * LOGIN
   * =========================================================
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);

      const destination = getRoleBasedRoute();

      navigate(destination, {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-slate-900 flex">

      {/* =====================================================
          LEFT VISUAL PANEL
      ===================================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#183c2b]">

        {/* Soft decorative shapes */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-lime-300/10 blur-3xl" />

        <div className="relative z-10 w-full flex flex-col justify-between p-12 xl:p-16 text-white">

          {/* Brand */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 w-fit"
          >
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-emerald-300" />
            </div>

            <div>
              <div className="text-xl font-bold tracking-tight">
                RASOI<span className="text-emerald-300">GRID</span>
              </div>

              <div className="text-[10px] uppercase tracking-[0.18em] text-emerald-100/60">
                The Urban Food Loop
              </div>
            </div>
          </Link>

          {/* Main message */}
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 border border-white/10 px-4 py-2 text-sm text-emerald-100 mb-7">
              <HeartHandshake className="w-4 h-4 text-emerald-300" />
              Food should reach people, not landfills.
            </div>

            <h1 className="text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
              Welcome back to
              <span className="block text-emerald-300 mt-2">
                the food loop.
              </span>
            </h1>

            <p className="mt-6 text-base xl:text-lg leading-8 text-emerald-50/70 max-w-lg">
              Connect surplus food with verified community networks,
              coordinate rescue, and keep unavoidable organic waste
              moving toward circular recovery.
            </p>

            {/* Flow */}
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg">

              {/* Surplus */}
              <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
                <UtensilsCrossed className="w-5 h-5 text-emerald-300 mb-3" />

                <div className="text-sm font-semibold">
                  Surplus
                </div>

                <div className="text-xs text-white/45 mt-1">
                  Food becomes visible
                </div>
              </div>

              {/* Rescue */}
              <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
                <HeartHandshake className="w-5 h-5 text-lime-300 mb-3" />

                <div className="text-sm font-semibold">
                  Rescue
                </div>

                <div className="text-xs text-white/45 mt-1">
                  People first
                </div>
              </div>

              {/* Recover */}
              <div className="rounded-2xl bg-white/8 border border-white/10 p-4">
                <Leaf className="w-5 h-5 text-emerald-200 mb-3" />

                <div className="text-sm font-semibold">
                  Recover
                </div>

                <div className="text-xs text-white/45 mt-1">
                  Landfill last
                </div>
              </div>

            </div>
          </div>

          {/* Bottom statement */}
          <div className="flex items-center gap-3 text-sm text-white/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />

            <span>
              People first • Circular recovery • Landfill last
            </span>
          </div>

        </div>
      </div>

      {/* =====================================================
          RIGHT LOGIN PANEL
      ===================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-5 py-10 sm:px-8">

        <div className="w-full max-w-md">

          {/* Mobile brand */}
          <div className="lg:hidden mb-10 text-center">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-700" />
              </div>

              <div className="text-left">
                <div className="font-bold text-lg">
                  RASOI<span className="text-emerald-600">GRID</span>
                </div>

                <div className="text-[9px] uppercase tracking-wider text-slate-400">
                  The Urban Food Loop
                </div>
              </div>
            </Link>

          </div>

          {/* Heading */}
          <div className="mb-8">

            <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 mb-4">
              <Leaf className="w-4 h-4" />
              Welcome back
            </div>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Sign in to RasoiGrid
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Continue coordinating food surplus, rescue missions,
              and circular recovery.
            </p>

          </div>

          {/* =================================================
              LOGIN FORM
          ================================================= */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
          >

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email address
              </label>

              <div className="relative">

                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

              </div>

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Signing you in...'
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Register */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}

              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Create an account
              </Link>
            </p>

          </form>

          {/* Trust note */}
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
            <LockKeyhole className="w-3.5 h-3.5" />

            Your account is protected with secure authentication.
          </div>

        </div>

      </div>

    </div>
  );
};