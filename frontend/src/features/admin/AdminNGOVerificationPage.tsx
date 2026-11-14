import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../core/api/client";
import type { NGODTO } from "../../core/api/types";
import {
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  ShieldCheck,
  FileCheck2,
} from "lucide-react";

type VerificationStatus = "VERIFIED" | "PENDING" | "REJECTED";

export const AdminNGOVerificationPage: React.FC = () => {
  const [ngoRecords, setNgoRecords] = useState<NGODTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      setNgoRecords(await api.getAllNgos());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load NGOs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleVerify = async (id: number) => {
    setVerifyingId(id);
    setError("");
    try {
      const updated = await api.verifyNgo(id);
      setNgoRecords((rows) => rows.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify the NGO.");
    } finally {
      setVerifyingId(null);
    }
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | VerificationStatus
  >("ALL");

  const filteredNGOs = ngoRecords.filter((ngo) => {
    const matchesSearch =
      ngo.organization_name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.address.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      ngo.verification_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const verifiedCount = ngoRecords.filter(
    (ngo) => ngo.verification_status === "VERIFIED"
  ).length;

  const pendingCount = ngoRecords.filter(
    (ngo) => ngo.verification_status === "PENDING"
  ).length;

  const rejectedCount = ngoRecords.filter(
    (ngo) => ngo.verification_status === "REJECTED"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                ADMIN MISSION CONTROL
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                NGO Verification
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review and manage verified food-rescue organizations
                participating in the RasoiGrid network.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4">
              <Building2 className="h-7 w-7 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Partner Network
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {ngoRecords.length} NGOs
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Verified NGOs
              </p>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {verifiedCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Active rescue partners
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Pending Review
              </p>
              <Clock3 className="h-5 w-5 text-amber-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {pendingCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Awaiting admin verification
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Rejected
              </p>
              <XCircle className="h-5 w-5 text-slate-400" />
            </div>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {rejectedCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Not approved for network access
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search NGO name or address..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["ALL", "VERIFIED", "PENDING", "REJECTED"] as const).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                      statusFilter === status
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status === "ALL"
                      ? "All"
                      : status.charAt(0) +
                        status.slice(1).toLowerCase()}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* NGO list */}
        <div className="space-y-4">
          {error && (
            <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {filteredNGOs.map((ngo) => (
            <div
              key={ngo.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <Building2 className="h-6 w-6 text-emerald-600" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-slate-900">
                        {ngo.organization_name}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          ngo.verification_status === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-700"
                            : ngo.verification_status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {ngo.verification_status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {ngo.address}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                      <span>
                        Capacity:{" "}
                        <strong className="text-slate-700">
                          {ngo.capacity.toLocaleString()} kg
                        </strong>
                      </span>

                      <span>
                        Location:{" "}
                        <strong className="text-slate-700">
                          {ngo.latitude != null && ngo.longitude != null
                            ? `${ngo.latitude.toFixed(4)}, ${ngo.longitude.toFixed(4)}`
                            : "Not given"}
                        </strong>
                      </span>

                      <span>
                        NGO ID:{" "}
                        <strong className="text-slate-700">#{ngo.id}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ngo.verification_status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => handleVerify(ngo.id)}
                      disabled={verifyingId === ngo.id}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      <FileCheck2 className="h-4 w-4" />
                      {verifyingId === ngo.id ? "Verifying…" : "Verify NGO"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredNGOs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                {isLoading ? "Loading NGOs…" : ngoRecords.length === 0 ? "No NGOs have registered yet" : "No NGOs found"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {ngoRecords.length === 0 ? "NGOs appear here after they set up their profile." : "Try changing your search or filter."}
              </p>
            </div>
          )}
        </div>

        {/* Governance note */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <h3 className="font-semibold text-slate-900">
                Verification & Governance
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Only verified organizations should participate in
                coordinated rescue workflows. Document review,
                verification decisions and future access changes
                should be recorded in the RasoiGrid audit trail.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};