import React from "react";
import { Link } from "react-router-dom";
import { useRescueStore } from "../../stores/useRescueStore";
import { NgoPendingBanner, NgoProfileSetup } from "../../components/profile/ProfileSetup";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Leaf,
  MapPin,
  PackageCheck,
  Radio,
  Recycle,
  ShieldCheck,
  Truck,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";

type MissionStatus =
  | "Awaiting volunteer"
  | "Assigned"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

const MISSION_STATUS: Record<string, MissionStatus> = {
  PENDING: "Awaiting volunteer",
  ASSIGNED: "Assigned",
  PICKED_UP: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const formatHours = (h: number) =>
  h <= 0 ? "Past consume-before time" : h < 1 ? `${Math.round(h * 60)} min left` : `${h.toFixed(1)} h left`;

const statusStyles: Record<
  MissionStatus,
  {
    className: string;
    icon: React.ReactNode;
  }
> = {
  "Awaiting volunteer": {
    className: "bg-rose-50 text-rose-700",
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  Assigned: {
    className: "bg-amber-50 text-amber-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  "In Transit": {
    className: "bg-blue-50 text-blue-700",
    icon: <Truck className="h-3.5 w-3.5" />,
  },
  Delivered: {
    className: "bg-emerald-50 text-emerald-700",
    icon: <Leaf className="h-3.5 w-3.5" />,
  },
  Cancelled: {
    className: "bg-slate-100 text-slate-500",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
};

export const NGODashboardPage: React.FC = () => {
  const { surplusList, missionsList, ngoProfile, hasLoaded, error } = useRescueStore();

  const available = surplusList.filter((d) => d.backendStatus === "AVAILABLE");
  const availableKg = available.reduce((sum, d) => sum + d.quantityKg, 0);
  const urgent = available.filter((d) => d.priority === "critical" || d.priority === "high");
  // Highest decision-engine score first; soonest deadline breaks ties.
  const mostUrgent = [...available].sort(
    (x, y) =>
      (y.priorityScore ?? 0) - (x.priorityScore ?? 0) || x.hoursLeft - y.hoursLeft,
  )[0];

  const activeMissions = missionsList.filter((m) =>
    ["PENDING", "ASSIGNED", "PICKED_UP"].includes(m.dispatchStatus),
  );
  const inTransit = missionsList.filter((m) => m.dispatchStatus === "PICKED_UP");
  const awaitingVolunteer = missionsList.filter((m) => m.dispatchStatus === "PENDING");
  const delivered = missionsList.filter((m) => m.dispatchStatus === "DELIVERED");
  const deliveredKg = delivered.reduce((sum, m) => sum + (m.surplusItem?.quantityKg ?? 0), 0);

  const recentMissions = missionsList.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                NGO Operations
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Urban Food Recovery Command
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                Monitor incoming surplus, prioritize recovery missions,
                coordinate verified receivers, and keep the urban food loop
                moving.
              </p>
            </div>

            <Link
              to="/app/command"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Activity className="h-4 w-4" />
              Open Live Operations
            </Link>

          </div>
        </div>
      </div>


      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {hasLoaded && !ngoProfile && <NgoProfileSetup />}

        {ngoProfile && ngoProfile.verification_status !== "VERIFIED" && <NgoPendingBanner />}

        {error && (
          <p role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* LIVE STATUS */}
        <section className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-sm">
                <Radio className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {ngoProfile?.organization_name ?? "Your NGO"}
                  </p>

                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                    {ngoProfile?.verification_status ?? "NO PROFILE"}
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                  Available donations and your pickups, loaded from the
                  RasoiGrid server.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {available.length} available donations
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {activeMissions.length} active pickups
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {urgent.length} urgent (under 6 h left)
              </span>

            </div>

          </div>

        </section>


        {/* METRICS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* INCOMING SURPLUS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Available Surplus
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {availableKg.toLocaleString()} kg
                </p>

                <p className="mt-2 text-xs font-medium text-emerald-600">
                  Across {available.length} donation{available.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>

            </div>
          </div>


          {/* PRIORITY MISSIONS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Urgent Donations
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {urgent.length}
                </p>

                <p className="mt-2 text-xs font-medium text-rose-600">
                  6 hours or less to consume
                </p>
              </div>

              <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                <Zap className="h-5 w-5" />
              </div>

            </div>
          </div>


          {/* ACTIVE RECEIVERS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Active Pickups
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {activeMissions.length}
                </p>

                <p className="mt-2 text-xs font-medium text-slate-500">
                  {inTransit.length} on the way
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users className="h-5 w-5" />
              </div>

            </div>
          </div>


          {/* RECOVERED TODAY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Delivered to You
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {deliveredKg.toLocaleString()} kg
                </p>

                <p className="mt-2 text-xs font-medium text-emerald-600">
                  {delivered.length} completed pickup{delivered.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <PackageCheck className="h-5 w-5" />
              </div>

            </div>
          </div>

        </section>


        {/* AI INTELLIGENCE */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-3">

                <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                  <BrainCircuit className="h-5 w-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-slate-900">
                      Most Urgent Donation
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    The available donation with the highest priority score.
                  </p>
                </div>

              </div>

              <Link
                to="/app/command"
                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"
              >
                Claim in live operations
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

            </div>

          </div>


          <div className="grid gap-4 p-5 lg:grid-cols-3">

            {/* AI RECOMMENDATION */}
            <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4 lg:col-span-2">

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-white p-2 text-violet-600 shadow-sm">
                  <BrainCircuit className="h-4 w-4" />
                </div>

                <div className="min-w-0">

                  <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                    Claim this first
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-slate-900">
                    {mostUrgent ? mostUrgent.foodName : "No donations are waiting right now"}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    {mostUrgent
                      ? `${mostUrgent.quantityKg} kg from ${mostUrgent.donorName}, about ${mostUrgent.portions} meals.`
                      : "New donations from nearby donors will show up here."}
                  </p>

                </div>

              </div>


              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                <div className="rounded-lg bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Priority
                  </p>
                  <p className="mt-1 text-sm font-bold uppercase text-rose-600">
                    {mostUrgent?.priority ?? "—"}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Time left
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {mostUrgent ? formatHours(mostUrgent.hoursLeft) : "—"}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 truncate text-sm font-bold text-violet-600">
                    {mostUrgent?.location?.neighborhood ?? "—"}
                  </p>
                </div>

              </div>

            </div>


            {/* AI SAFETY NOTE */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Human safety decision
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Priority here is based only on time left. It does not
                    certify food as safe to eat.
                  </p>

                  <p className="mt-3 text-xs font-semibold text-slate-700">
                    Authorized personnel retain final eligibility authority.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ACTIVE MISSIONS + OPERATIONS */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* ACTIVE MISSIONS */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Your Pickups
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest dispatches for your NGO
                </p>
              </div>

              <Link
                to="/app/command"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View operations
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

            </div>


            <div className="divide-y divide-slate-100">

              {recentMissions.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-slate-500">
                  No pickups yet. Claim a donation in live operations to create one.
                </p>
              )}

              {recentMissions.map((mission) => {

                const statusLabel = MISSION_STATUS[mission.dispatchStatus] ?? "Assigned";
                const status = statusStyles[statusLabel];

                return (
                  <div
                    key={mission.id}
                    className="px-5 py-4 transition hover:bg-slate-50"
                  >

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                      {/* SOURCE */}
                      <div className="flex min-w-0 items-start gap-3">

                        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                          <UtensilsCrossed className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-sm font-semibold text-slate-900">
                              {mission.surplusItem?.foodName ?? "Donation"}
                            </h3>

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                              {mission.code}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {mission.surplusItem?.donorName ?? "Donor"} · {mission.surplusItem?.quantityKg ?? 0} kg
                          </p>

                          {mission.handoverCode &&
                            ["PENDING", "ASSIGNED", "PICKED_UP"].includes(mission.dispatchStatus) && (
                              <p className="mt-1 text-xs text-amber-700">
                                Handover code:{" "}
                                <strong className="font-mono tracking-widest">
                                  {mission.handoverCode}
                                </strong>
                              </p>
                            )}

                        </div>

                      </div>


                      {/* RECEIVER */}
                      <div className="min-w-0 xl:w-56">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Volunteer
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {mission.driverName}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {mission.distanceKm !== null ? `${mission.distanceKm} km route` : "Route distance unknown"}
                        </p>

                      </div>


                      {/* STATUS */}
                      <div className="flex items-center justify-between gap-3 xl:w-44 xl:justify-end">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.icon}
                          {statusLabel}
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>


          {/* OPERATIONS SNAPSHOT */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-5 py-4">

              <h2 className="font-semibold text-slate-900">
                Operations Snapshot
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current network state
              </p>

            </div>


            <div className="p-5">

              <div className="space-y-5">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                      <Users className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Available Donations
                      </p>

                      <p className="text-xs text-slate-500">
                        Ready to claim
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-bold text-emerald-600">
                    {available.length}
                  </span>
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Truck className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Active Routes
                      </p>

                      <p className="text-xs text-slate-500">
                        Currently moving
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-bold text-blue-600">
                    {inTransit.length}
                  </span>
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Awaiting Volunteer
                      </p>

                      <p className="text-xs text-slate-500">
                        No volunteer was free
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-bold text-amber-600">
                    {awaitingVolunteer.length}
                  </span>
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                      <BrainCircuit className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Completed Pickups
                      </p>

                      <p className="text-xs text-slate-500">
                        Delivered to your NGO
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-bold text-violet-600">
                    {delivered.length}
                  </span>
                </div>

              </div>


              <div className="mt-6 rounded-xl bg-slate-50 p-4">

                <div className="flex items-start gap-2">

                  <Recycle className="mt-0.5 h-4 w-4 text-emerald-600" />

                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      People first
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      Check food on arrival. Only accept what is safe to
                      serve; route the rest to composting or biogas.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* COMMAND FLOW */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Activity className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  RasoiGrid Recovery Loop
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  The operational sequence your NGO coordinates
                </p>
              </div>

            </div>

          </div>


          <div className="grid md:grid-cols-4">

            <div className="border-b border-slate-100 p-5 md:border-b-0 md:border-r">

              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                01 · Detect
              </p>

              <h3 className="mt-2 font-semibold text-slate-900">
                Surplus Signal
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Donors report available food before it becomes waste.
              </p>

            </div>


            <div className="border-b border-slate-100 p-5 md:border-b-0 md:border-r">

              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                02 · Prioritize
              </p>

              <h3 className="mt-2 font-semibold text-slate-900">
                AI Intelligence
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Gemini-assisted intelligence helps prioritize and recommend
                recovery actions.
              </p>

            </div>


            <div className="border-b border-slate-100 p-5 md:border-b-0 md:border-r">

              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                03 · Route
              </p>

              <h3 className="mt-2 font-semibold text-slate-900">
                Match & Dispatch
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Coordinate eligible surplus with available receivers and
                logistics.
              </p>

            </div>


            <div className="p-5">

              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                04 · Recover
              </p>

              <h3 className="mt-2 font-semibold text-slate-900">
                People First
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Safe edible food goes to people; unavoidable organic material
                follows circular recovery pathways.
              </p>

            </div>

          </div>

        </section>


        {/* QUICK LINKS */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">

          <Link
            to="/app/command"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Activity className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Live Operations
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Monitor active recovery missions.
                  </p>
                </div>

              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />

            </div>
          </Link>


          <Link
            to="/app/receivers"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Receiver Network
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Manage verified receiving points.
                  </p>
                </div>

              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />

            </div>
          </Link>


          <Link
            to="/app/circular"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-amber-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Recycle className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Circular Recovery
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Track non-edible organic recovery.
                  </p>
                </div>

              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-600" />

            </div>
          </Link>

        </section>


        {/* PRINCIPLES */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="grid md:grid-cols-3">

            <div className="border-b border-slate-100 p-5 md:border-b-0 md:border-r">

              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                01
              </p>

              <h3 className="mt-2 font-semibold text-slate-900">
                People First
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Prioritize safe, eligible surplus for people who can use it.
              </p>

            </div>


            <div className="border-b border-slate-100 p-5 md:border-b-0 md:border-r">

              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                02
              </p>

              <h3 className="mt-2 font-semibold text-slate-900">
                Circular Recovery
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Keep unavoidable organic material useful through appropriate
                recovery pathways.
              </p>

            </div>


            <div className="p-5">

              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                03
              </p>

              <h3 className="mt-2 font-semibold text-slate-900">
                Landfill Last
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Reduce the amount of recoverable food and organic material
                sent to landfill.
              </p>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
};

export default NGODashboardPage;