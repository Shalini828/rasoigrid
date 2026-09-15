import React from "react";
import { Link } from "react-router-dom";
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
  | "Priority"
  | "Matched"
  | "In Transit"
  | "Recovered";

interface Mission {
  id: string;
  source: string;
  food: string;
  quantity: string;
  receiver: string;
  distance: string;
  status: MissionStatus;
  priority: string;
}

const activeMissions: Mission[] = [
  {
    id: "RG-1042",
    source: "Hotel / Catering",
    food: "Cooked rice & vegetable curry",
    quantity: "18 kg",
    receiver: "Community Meal Network",
    distance: "2.4 km",
    status: "Priority",
    priority: "High",
  },
  {
    id: "RG-1038",
    source: "Bakery",
    food: "Fresh bread & bakery items",
    quantity: "9 kg",
    receiver: "Local Food Rescue Partner",
    distance: "3.1 km",
    status: "In Transit",
    priority: "Medium",
  },
  {
    id: "RG-1031",
    source: "Restaurant",
    food: "Prepared lunch surplus",
    quantity: "24 kg",
    receiver: "Circular Recovery",
    distance: "4.8 km",
    status: "Recovered",
    priority: "Low",
  },
];

const statusStyles: Record<
  MissionStatus,
  {
    className: string;
    icon: React.ReactNode;
  }
> = {
  Priority: {
    className: "bg-rose-50 text-rose-700",
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  Matched: {
    className: "bg-amber-50 text-amber-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  "In Transit": {
    className: "bg-blue-50 text-blue-700",
    icon: <Truck className="h-3.5 w-3.5" />,
  },
  Recovered: {
    className: "bg-emerald-50 text-emerald-700",
    icon: <Leaf className="h-3.5 w-3.5" />,
  },
};

export const NGODashboardPage: React.FC = () => {
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
                    Network operations are live
                  </p>

                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                    LIVE
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                  Surplus signals, recovery missions, and active routes are
                  being coordinated across the network.
                </p>
              </div>

            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                142 active nodes
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                18 active missions
              </span>

              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                6 priority alerts
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
                  Incoming Surplus
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  186 kg
                </p>

                <p className="mt-2 text-xs font-medium text-emerald-600">
                  +23 kg in the last hour
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
                  Priority Missions
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  6
                </p>

                <p className="mt-2 text-xs font-medium text-rose-600">
                  Require attention now
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
                  Active Receivers
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  27
                </p>

                <p className="mt-2 text-xs font-medium text-slate-500">
                  Verified receiving points
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
                  Recovered Today
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  124 kg
                </p>

                <p className="mt-2 text-xs font-medium text-emerald-600">
                  89 kg for people
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
                      AI Recovery Intelligence
                    </h2>

                    <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                      Gemini Assisted
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Prioritization and routing recommendations for active
                    surplus.
                  </p>
                </div>

              </div>

              <Link
                to="/app/forecast"
                className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"
              >
                Open prediction matrix
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
                    Current recommendation
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-slate-900">
                    Prioritize RG-1042 for immediate receiver matching
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    18 kg of prepared food has a high recovery priority based
                    on quantity, food type, reported handling window, and
                    current receiver demand.
                  </p>

                </div>

              </div>


              <div className="mt-4 grid gap-3 sm:grid-cols-3">

                <div className="rounded-lg bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Priority
                  </p>
                  <p className="mt-1 text-sm font-bold text-rose-600">
                    HIGH
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Suggested route
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    Receiver match
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Confidence
                  </p>
                  <p className="mt-1 text-sm font-bold text-violet-600">
                    87%
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
                    AI supports prioritization and recommendations. It does
                    not certify food as microbiologically safe.
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
                  Active Recovery Missions
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Current surplus-to-recovery operations
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

              {activeMissions.map((mission) => {

                const status = statusStyles[mission.status];

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
                              {mission.food}
                            </h3>

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                              {mission.id}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {mission.source} · {mission.quantity}
                          </p>

                        </div>

                      </div>


                      {/* RECEIVER */}
                      <div className="min-w-0 xl:w-56">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Receiver
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-700">
                          {mission.receiver}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {mission.distance}
                        </p>

                      </div>


                      {/* STATUS */}
                      <div className="flex items-center justify-between gap-3 xl:w-32 xl:justify-end">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.icon}
                          {mission.status}
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
                        Verified Receivers
                      </p>

                      <p className="text-xs text-slate-500">
                        Ready to receive
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-bold text-emerald-600">
                    21
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
                    8
                  </span>
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                      <Clock3 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Awaiting Match
                      </p>

                      <p className="text-xs text-slate-500">
                        Need assignment
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-bold text-amber-600">
                    5
                  </span>
                </div>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                      <BrainCircuit className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        AI Recommendations
                      </p>

                      <p className="text-xs text-slate-500">
                        Generated today
                      </p>
                    </div>

                  </div>

                  <span className="text-sm font-bold text-violet-600">
                    34
                  </span>
                </div>

              </div>


              <div className="mt-6 rounded-xl bg-slate-50 p-4">

                <div className="flex items-start gap-2">

                  <Recycle className="mt-0.5 h-4 w-4 text-emerald-600" />

                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Circular recovery
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      35 kg of today's unavoidable organic surplus has been
                      directed toward appropriate recovery pathways.
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