import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  ArrowRight,
  Leaf,
  HeartHandshake,
  Recycle,
  UtensilsCrossed,
} from 'lucide-react';
import { useAuthStore, type UserRole } from '../../stores/useAuthStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] =
    useState<Exclude<UserRole, 'ADMIN'>>('DONOR');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(
        name,
        email,
        phone,
        password,
        role
      );

      navigate('/login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-slate-900 lg:flex">

      {/* LEFT — BRAND / FOOD LOOP STORY */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#164c36] lg:flex lg:w-[50%] xl:w-[52%]">
        
        {/* Soft background glow */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <Leaf className="h-6 w-6 text-emerald-300" />
              </div>

              <div>
                <div className="text-2xl font-bold tracking-tight text-white">
                  RASOI<span className="text-emerald-300">GRID</span>
                </div>

                <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-200/70">
                  The Urban Food Loop
                </div>
              </div>
            </Link>
          </div>

          {/* Main story */}
          <div className="max-w-xl">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-emerald-100">
              <HeartHandshake className="h-4 w-4" />
              Food should reach people, not landfills.
            </div>

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white xl:text-6xl">
              Join the
              <span className="block text-emerald-300">
                food loop.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-8 text-emerald-50/75">
              Connect surplus food with verified community
              networks, coordinate rescue, and help keep
              unavoidable organic waste moving toward
              circular recovery.
            </p>

            {/* Three principles */}
            <div className="mt-10 grid grid-cols-3 gap-3">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <UtensilsCrossed className="mb-4 h-5 w-5 text-emerald-300" />

                <div className="text-sm font-semibold text-white">
                  Share
                </div>

                <div className="mt-1 text-xs leading-5 text-emerald-100/60">
                  Make surplus visible
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <HeartHandshake className="mb-4 h-5 w-5 text-lime-300" />

                <div className="text-sm font-semibold text-white">
                  Rescue
                </div>

                <div className="mt-1 text-xs leading-5 text-emerald-100/60">
                  People first
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <Recycle className="mb-4 h-5 w-5 text-emerald-200" />

                <div className="text-sm font-semibold text-white">
                  Recover
                </div>

                <div className="mt-1 text-xs leading-5 text-emerald-100/60">
                  Landfill last
                </div>
              </div>

            </div>

            <div className="mt-9 flex items-center gap-2 text-sm text-emerald-100/65">
              <div className="h-2 w-2 rounded-full bg-emerald-300" />
              People first
              <span className="text-white/30">•</span>
              Circular recovery
              <span className="text-white/30">•</span>
              Landfill last
            </div>
          </div>

          {/* Bottom */}
          <div className="text-xs text-emerald-100/45">
            RASOIGRID · URBAN FOOD RECOVERY NETWORK
          </div>

        </div>
      </section>

      {/* RIGHT — CREATE ACCOUNT */}
      <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">

        <div className="w-full max-w-xl">

          {/* Mobile brand */}
          <div className="mb-10 flex items-center justify-center lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <div className="text-xl font-bold text-slate-900">
                  RASOI<span className="text-emerald-600">GRID</span>
                </div>

                <div className="text-[10px] uppercase tracking-widest text-slate-400">
                  The Urban Food Loop
                </div>
              </div>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">

            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
              <Leaf className="h-4 w-4" />
              Join the food loop
            </div>

            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Create your
              <span className="block text-emerald-600">
                RasoiGrid account.
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
              Choose how you want to participate in food
              surplus recovery and help move food toward
              people, not landfills.
            </p>

          </div>

          {/* Form card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8"
          >

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </label>

                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 8 characters for your password.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  How would you like to participate?
                </label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(
                      e.target.value as Exclude<UserRole, 'ADMIN'>
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="DONOR">
                    Food Donor
                  </option>

                  <option value="NGO">
                    NGO / Community Receiver
                  </option>

                  <option value="VOLUNTEER">
                    Rescue Volunteer
                  </option>
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  You can join as a donor, community receiver,
                  or rescue volunteer.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  'Creating your account...'
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

            </div>

            {/* Login link */}
            <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                Sign in
              </Link>
            </div>

          </form>

          {/* Footer note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
            <LockKeyhole className="h-3.5 w-3.5" />
            Your account is protected with secure authentication.
          </div>

        </div>
      </section>
    </div>
  );
};