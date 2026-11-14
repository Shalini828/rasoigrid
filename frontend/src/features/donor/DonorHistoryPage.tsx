import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRescueStore } from "../../stores/useRescueStore";
import type { FoodSurplusItem } from "../../core/types/models";
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
  | "Waiting"
  | "Claimed"
  | "Picked up"
  | "Delivered"
  | "Cancelled"
  | "Expired";

const STATUS_FROM_API: Record<string, DonationStatus> = {
  AVAILABLE: "Waiting",
  CLAIMED: "Claimed",
  IN_TRANSIT: "Picked up",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

const NEXT_STEP: Record<DonationStatus, string> = {
  Waiting: "Visible to verified NGOs",
  Claimed: "An NGO is arranging pickup",
  "Picked up": "A volunteer is delivering it",
  Delivered: "Delivered to the NGO",
  Cancelled: "Withdrawn by you",
  Expired: "Not claimed in time; compost or other recovery",
};

const CATEGORY_LABEL: Record<string, string> = {
  cooked_meals: "Cooked meals",
  bakery_grains: "Bakery & grains",
  fresh_produce: "Fresh produce",
  dairy_cold: "Dairy & cold",
  packaged_dry: "Packaged dry",
  non_edible_organic: "Organic scraps",
};

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

const toRecord = (item: FoodSurplusItem): DonationRecord => {
  const when = new Date(item.createdAt ?? item.cookedAt);
  const status = STATUS_FROM_API[item.backendStatus] ?? "Waiting";
  return {
    id: item.id,
    food: item.foodName,
    category: CATEGORY_LABEL[item.category] ?? item.category,
    quantity: item.quantityKg,
    portions: item.portions,
    destination: NEXT_STEP[status],
    location: item.location?.neighborhood ?? "No location",
    status,
    date: when.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    time: when.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
};

const statusStyles: Record<
  DonationStatus,
  {
    className: string;
    icon: React.ReactNode;
  }
> = {
  Waiting: {
    className: "bg-slate-100 text-slate-600",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
  Claimed: {
    className: "bg-amber-50 text-amber-700",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
  "Picked up": {
    className: "bg-blue-50 text-blue-700",
    icon: <PackageCheck className="h-3.5 w-3.5" />,
  },
  Delivered: {
    className: "bg-emerald-50 text-emerald-700",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  Cancelled: {
    className: "bg-red-50 text-red-600",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
  Expired: {
    className: "bg-slate-200 text-slate-600",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
};

export const DonorHistoryPage: React.FC = () => {
  const { surplusList, cancelSurplus, isLoading, error } = useRescueStore();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const donationRecords = useMemo(() => surplusList.map(toRecord), [surplusList]);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Withdraw this donation? NGOs will no longer see it.")) return;
    setCancellingId(id);
    setActionError("");
    try {
      await cancelSurplus(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not cancel the donation.");
    } finally {
      setCancellingId(null);
    }
  };

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
  }, [donationRecords, searchTerm, statusFilter]);

  const counted = donationRecords.filter(
    (r) => r.status !== "Cancelled" && r.status !== "Expired",
  );

  const totalQuantity = counted.reduce(
    (sum, record) => sum + record.quantity,
    0
  );

  const totalPortions = counted.reduce(
    (sum, record) => sum + record.portions,
    0
  );

  const recoveredCount = donationRecords.filter(
    (record) => record.status === "Delivered"
  ).length;

  const activeCount = donationRecords.filter(
    (record) =>
      record.status === "Waiting" ||
      record.status === "Claimed" ||
      record.status === "Picked up"
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
                  "Waiting",
                  "Claimed",
                  "Picked up",
                  "Delivered",
                  "Cancelled",
                  "Expired",
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


          {(error || actionError) && (
            <p role="alert" className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
              {actionError || error}
            </p>
          )}

          {filteredRecords.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Search className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {isLoading ? "Loading…" : donationRecords.length === 0 ? "No donations yet" : "No records found"}
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                {donationRecords.length === 0
                  ? "Log your first surplus and it will appear here."
                  : "Try changing your search or status filter."}
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
                            #{record.id} · {record.date} · {record.time}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                            <span className="font-medium text-slate-700">
                              {record.quantity} kg
                            </span>

                            <span>
                              About {record.portions} meals
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
                          Where it is
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {record.destination}
                        </p>

                      </div>


                      {/* STATUS */}
                      <div className="flex items-center justify-between gap-4 xl:w-56 xl:justify-end">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.icon}
                          {record.status}
                        </span>

                        {record.status === "Waiting" ? (
                          <button
                            type="button"
                            onClick={() => handleCancel(record.id)}
                            disabled={cancellingId === record.id}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                          >
                            {cancellingId === record.id ? "Cancelling…" : "Cancel"}
                          </button>
                        ) : (
                          <ArrowRight className="hidden h-4 w-4 text-slate-300 xl:block" />
                        )}

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