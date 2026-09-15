import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Filter,
  Leaf,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";

type DonationStatus =
  | "Matched"
  | "Collected"
  | "Recovered"
  | "Pending";

type DonationRecord = {
  id: string;
  food: string;
  category: string;
  quantity: number;
  portions: number;
  destination: string;
  location: string;
  status: DonationStatus;
  date: string;
  time: string;
};

const donationRecords: DonationRecord[] = [
  {
    id: "RG-1042",
    food: "Cooked rice & vegetable curry",
    category: "Prepared Food",
    quantity: 18,
    portions: 72,
    destination: "Community meal network",
    location: "Bandra West",
    status: "Matched",
    date: "15 Sep 2026",
    time: "10:40 AM",
  },
  {
    id: "RG-1038",
    food: "Fresh bread & bakery items",
    category: "Bakery",
    quantity: 9,
    portions: 36,
    destination: "Local food rescue partner",
    location: "Bandra West",
    status: "Collected",
    date: "14 Sep 2026",
    time: "6:15 PM",
  },
  {
    id: "RG-1031",
    food: "Prepared lunch surplus",
    category: "Prepared Food",
    quantity: 24,
    portions: 96,
    destination: "Circular recovery",
    location: "Bandra West",
    status: "Recovered",
    date: "12 Sep 2026",
    time: "2:20 PM",
  },
  {
    id: "RG-1026",
    food: "Fresh vegetables",
    category: "Produce",
    quantity: 15,
    portions: 60,
    destination: "Community meal network",
    location: "Bandra West",
    status: "Recovered",
    date: "10 Sep 2026",
    time: "11:05 AM",
  },
  {
    id: "RG-1019",
    food: "Rice, dal & roti",
    category: "Prepared Food",
    quantity: 21,
    portions: 84,
    destination: "Community meal network",
    location: "Bandra West",
    status: "Pending",
    date: "8 Sep 2026",
    time: "8:30 PM",
  },
];

const statusStyles: Record<
  DonationStatus,
  {
    className: string;
    icon: React.ReactNode;
  }
> = {
  Matched: {
    className: "bg-amber-50 text-amber-700",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
  Collected: {
    className: "bg-blue-50 text-blue-700",
    icon: <PackageCheck className="h-3.5 w-3.5" />,
  },
  Recovered: {
    className: "bg-emerald-50 text-emerald-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  Pending: {
    className: "bg-slate-100 text-slate-600",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
};

export const DonorHistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | DonationStatus
  >("All");

  const filteredRecords = useMemo(() => {
    return donationRecords.filter((record) => {
      const matchesSearch =
        record.food
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.id
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        record.destination
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalQuantity = donationRecords.reduce(
    (sum, record) => sum + record.quantity,
    0
  );

  const totalPortions = donationRecords.reduce(
    (sum, record) => sum + record.portions,
    0
  );

  const recoveredCount = donationRecords.filter(
    (record) => record.status === "Recovered"
  ).length;

  const activeCount = donationRecords.filter(
    (record) =>
      record.status === "Matched" ||
      record.status === "Collected" ||
      record.status === "Pending"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <Link
                to="/app/donor/dashboard"
                className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-emerald-600"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Dashboard
              </Link>

              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Donor Portal
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Donation History
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Track the surplus you've logged and follow each recovery
                record through the RasoiGrid food loop.
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


      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* SUMMARY CARDS */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Donations
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {donationRecords.length}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Surplus records logged
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
            </div>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Food Logged
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalQuantity} kg
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Across all records
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <PackageCheck className="h-5 w-5" />
              </div>
            </div>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Portions Recorded
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalPortions}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Potential meal portions
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
            </div>
          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Recovery Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {recoveredCount}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {activeCount} records still active
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Leaf className="h-5 w-5" />
              </div>
            </div>
          </div>

        </section>


        {/* PRINCIPLE BANNER */}
        <section className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

          <div className="flex items-start gap-3">

            <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                People first. Circular recovery second. Landfill last.
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">
                Status updates show where each surplus record is in its
                recovery journey. Safety and eligibility decisions remain
                with authorized personnel.
              </p>
            </div>

          </div>

        </section>


        {/* FILTER BAR */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:max-w-md">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search food, ID or destination..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />

            </div>


            {/* FILTER */}
            <div className="flex flex-wrap items-center gap-2">

              <div className="mr-1 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Filter className="h-3.5 w-3.5" />
                Status
              </div>

              {(
                [
                  "All",
                  "Matched",
                  "Collected",
                  "Recovered",
                  "Pending",
                ] as const
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === status
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}

            </div>

          </div>

        </section>


        {/* DONATION LIST */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-semibold text-slate-900">
                Your Surplus Records
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredRecords.length} record
                {filteredRecords.length === 1 ? "" : "s"} shown
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" />
              Recovery records
            </div>

          </div>


          {filteredRecords.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Search className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No records found
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Try changing your search or status filter.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {filteredRecords.map((record) => {

                const status = statusStyles[record.status];

                return (
                  <div
                    key={record.id}
                    className="px-5 py-5 transition hover:bg-slate-50"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* FOOD */}
                      <div className="flex min-w-0 items-start gap-4">

                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                          <UtensilsCrossed className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-sm font-semibold text-slate-900">
                              {record.food}
                            </h3>

                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                              {record.category}
                            </span>

                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            {record.id} · {record.date} · {record.time}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                            <span className="font-medium text-slate-700">
                              {record.quantity} kg
                            </span>

                            <span>
                              {record.portions} portions
                            </span>

                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {record.location}
                            </span>

                          </div>

                        </div>

                      </div>


                      {/* DESTINATION */}
                      <div className="min-w-0 xl:w-64">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recovery Destination
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {record.destination}
                        </p>

                      </div>


                      {/* STATUS */}
                      <div className="flex items-center justify-between gap-4 xl:w-36 xl:justify-end">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.icon}
                          {record.status}
                        </span>

                        <ArrowRight className="hidden h-4 w-4 text-slate-300 xl:block" />

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </section>


        {/* BOTTOM INFO */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  What the statuses mean
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  <strong>Matched</strong> means a recovery pathway has been
                  identified. <strong>Collected</strong> means the surplus has
                  been handed over for recovery. <strong>Recovered</strong>
                  indicates the record has completed its current recovery
                  pathway.
                </p>
              </div>

            </div>

          </div>


          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Leaf className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Keep the food loop moving
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Log surplus as early as possible so the system has more
                  time to identify an appropriate recovery pathway.
                </p>
              </div>

            </div>

          </div>

        </section>


        {/* FINAL ACTION */}
        <div className="mt-6 flex justify-center">

          <Link
            to="/app/donations"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            Log another surplus
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </main>
    </div>
  );
};

export default DonorHistoryPage;