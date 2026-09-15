import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Leaf,
  MapPin,
  PackageCheck,
  Plus,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export const DonorDashboardPage: React.FC = () => {
  const recentDonations = [
    {
      id: "RG-1042",
      food: "Cooked rice & vegetable curry",
      quantity: "18 kg",
      destination: "Community meal network",
      status: "Matched",
      time: "Today, 10:40 AM",
    },
    {
      id: "RG-1038",
      food: "Fresh bread & bakery items",
      quantity: "9 kg",
      destination: "Local food rescue partner",
      status: "Collected",
      time: "Yesterday, 6:15 PM",
    },
    {
      id: "RG-1031",
      food: "Prepared lunch surplus",
      quantity: "24 kg",
      destination: "Circular recovery",
      status: "Recovered",
      time: "12 Sep, 2:20 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Donor Portal
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your Food Recovery Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Track surplus, coordinate recovery, and see the impact your
                food donations create across the urban food loop.
              </p>
            </div>

            <Link
              to="/app/donations"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Log New Surplus
            </Link>

          </div>
        </div>
      </div>


      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* STATUS STRIP */}
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-white p-2 text-emerald-600 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  People-first recovery is active
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                  Eligible surplus is prioritized for human consumption before
                  appropriate circular recovery pathways.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Recovery network active
            </div>

          </div>
        </div>


        {/* METRICS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL SURPLUS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Surplus Logged
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  286 kg
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +18% this month
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
            </div>
          </div>


          {/* FOOD RECOVERED */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Food Recovered
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  241 kg
                </p>

                <p className="mt-2 text-xs font-medium text-slate-500">
                  84% of logged surplus
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>
          </div>


          {/* PEOPLE SERVED */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  People Potentially Served
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  520+
                </p>

                <p className="mt-2 text-xs font-medium text-slate-500">
                  Based on recorded portions
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>


          {/* CIRCULAR RECOVERY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Circular Recovery
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  45 kg
                </p>

                <p className="mt-2 text-xs font-medium text-slate-500">
                  Directed away from landfill
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Recycle className="h-5 w-5" />
              </div>
            </div>
          </div>

        </section>


        {/* MAIN GRID */}
        <section className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* RECENT ACTIVITY */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent Surplus Activity
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your latest food recovery records
                </p>
              </div>

              <Link
                to="/app/donor/history"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View history
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

            </div>


            <div className="divide-y divide-slate-100">

              {recentDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="px-5 py-4 transition hover:bg-slate-50"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-3">

                      <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                        <UtensilsCrossed className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {donation.food}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">

                          <span>{donation.quantity}</span>

                          <span className="hidden sm:block">•</span>

                          <span>{donation.destination}</span>

                        </div>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {donation.id} · {donation.time}
                        </p>
                      </div>

                    </div>


                    <div className="flex items-center gap-2">

                      {donation.status === "Recovered" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {donation.status}
                        </span>
                      ) : donation.status === "Collected" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          <PackageCheck className="h-3.5 w-3.5" />
                          {donation.status}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                          <Clock3 className="h-3.5 w-3.5" />
                          {donation.status}
                        </span>
                      )}

                    </div>

                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* RECOVERY PIPELINE */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Recovery Pipeline
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                What happens after you log surplus
              </p>
            </div>


            <div className="p-5">

              <div className="space-y-5">

                {/* STEP 1 */}
                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <UtensilsCrossed className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Surplus Logged
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Food details and handling information are recorded.
                    </p>
                  </div>

                </div>


                {/* LINE */}
                <div className="ml-4 h-5 border-l border-dashed border-slate-300" />


                {/* STEP 2 */}
                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Safety & Eligibility Check
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Authorized personnel assess whether the surplus is
                      suitable for human consumption.
                    </p>
                  </div>

                </div>


                {/* LINE */}
                <div className="ml-4 h-5 border-l border-dashed border-slate-300" />


                {/* STEP 3 */}
                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Recovery Route Assigned
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Eligible food is matched to the appropriate recovery
                      network.
                    </p>
                  </div>

                </div>


                {/* LINE */}
                <div className="ml-4 h-5 border-l border-dashed border-slate-300" />


                {/* STEP 4 */}
                <div className="flex gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Leaf className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      People First / Circular Recovery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Safe edible surplus is prioritized for people. The
                      remainder follows an appropriate circular pathway.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* QUICK ACTIONS */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">

          <Link
            to="/app/donations"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Plus className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    Log Food Surplus
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Record food before it becomes waste.
                  </p>
                </div>

              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />

            </div>
          </Link>


          <Link
            to="/app/donor/history"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    View Donation History
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Track every surplus record and its recovery status.
                  </p>
                </div>

              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />

            </div>
          </Link>

        </section>


        {/* BOTTOM PRINCIPLE */}
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
                Safe, eligible surplus should reach people who can use it.
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
                Unavoidable organic surplus should remain useful through
                appropriate recovery pathways.
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
                RasoiGrid aims to prevent recoverable food and organic
                resources from ending up in landfill.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default DonorDashboardPage;