import React, { useEffect, useState } from "react";
import {
  FileCheck2,
  ShieldCheck,
  Search,
  Clock3,
  UserCheck,
  Truck,
  HeartHandshake,
  Recycle,
  AlertTriangle,
} from "lucide-react";

import { api } from "../../core/api/client";
import { parseApiDate } from "../../core/api/mappers";
import type { AdminAuditDTO } from "../../core/api/types";

type AuditType = "DONATION" | "CLAIM" | "HANDOVER" | "CLOSED";

interface AuditRecord {
  id: string;
  type: AuditType;
  action: string;
  actor: string;
  actorRole: string;
  reference: string;
  details: string;
  timestamp: string;
  status: "COMPLETED" | "REVIEW";
}

/** Backend audit actions, grouped for the filter and labelled for people. */
const ACTIONS: Record<string, { type: AuditType; label: string; review?: boolean }> = {
  DONATED: { type: "DONATION", label: "Food listed by donor" },
  REQUESTED: { type: "CLAIM", label: "NGO asked for the food" },
  ACCEPTED: { type: "CLAIM", label: "NGO claimed the food" },
  MATCHED: { type: "CLAIM", label: "Donation matched" },
  DISPATCHED: { type: "CLAIM", label: "Volunteer pickup created" },
  PICKED_UP: { type: "HANDOVER", label: "Volunteer picked up the food" },
  DELIVERED: { type: "HANDOVER", label: "Food delivered to the NGO" },
  RECOVERY: { type: "HANDOVER", label: "Sent to organic recovery" },
  CANCELLED: { type: "CLOSED", label: "Cancelled", review: true },
  EXPIRED: { type: "CLOSED", label: "Expired before anyone claimed it", review: true },
};

const ROLE_LABEL: Record<string, string> = {
  DONOR: "Donor",
  NGO: "NGO",
  VOLUNTEER: "Volunteer",
  ADMIN: "Admin",
  SYSTEM: "System",
};

const toAuditRecord = (e: AdminAuditDTO): AuditRecord => {
  const info = ACTIONS[e.action] ?? { type: "CLAIM" as AuditType, label: e.action };
  return {
    id: `AUD-${e.id}`,
    type: info.type,
    action: info.label,
    actor:
      e.actor_name ??
      (e.actor_type === "SYSTEM" ? "RasoiGrid" : `${ROLE_LABEL[e.actor_type] ?? e.actor_type} #${e.actor_id ?? "?"}`),
    actorRole: ROLE_LABEL[e.actor_type] ?? e.actor_type,
    reference: `Donation #${e.donation_id}${e.food_name ? ` · ${e.food_name}` : ""}`,
    details: e.details ?? "",
    timestamp: parseApiDate(e.timestamp).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: info.review ? "REVIEW" : "COMPLETED",
  };
};

export const AdminAuditPage: React.FC = () => {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getAdminAudit(500)
      .then((rows) => {
        if (!cancelled) setAuditRecords(rows.map(toAuditRecord));
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load the audit trail.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handoverCount = auditRecords.filter((r) => r.action === ACTIONS.DELIVERED.label).length;
  const reviewCount = auditRecords.filter((r) => r.status === "REVIEW").length;
  const donationCount = new Set(auditRecords.map((r) => r.reference.split(" · ")[0])).size;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | AuditType>("ALL");

  const filteredRecords = auditRecords.filter((record) => {
    const matchesSearch =
      record.action.toLowerCase().includes(search.toLowerCase()) ||
      record.actor.toLowerCase().includes(search.toLowerCase()) ||
      record.reference.toLowerCase().includes(search.toLowerCase()) ||
      record.details.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" || record.type === filter;

    return matchesSearch && matchesFilter;
  });

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
                Audit & Compliance
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review the digital activity trail across verification,
                dispatch, handover, recovery and access-control events.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4">
              <FileCheck2 className="h-7 w-7 text-emerald-600" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Audit Trail
                </p>
                <p className="text-lg font-bold text-slate-900">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={<FileCheck2 className="h-5 w-5 text-emerald-600" />}
            label="Recorded Events"
            value={auditRecords.length.toLocaleString("en-IN")}
            detail="Most recent 500 shown"
          />

          <Metric
            icon={<UserCheck className="h-5 w-5 text-blue-600" />}
            label="Deliveries"
            value={handoverCount.toLocaleString("en-IN")}
            detail="Food handed to an NGO"
          />

          <Metric
            icon={<ShieldCheck className="h-5 w-5 text-violet-600" />}
            label="Donations Traced"
            value={donationCount.toLocaleString("en-IN")}
            detail="With at least one event"
          />

          <Metric
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
            label="Cancelled or Expired"
            value={reviewCount.toLocaleString("en-IN")}
            detail="Food that did not reach people"
          />
        </div>

        {/* Principle */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <h2 className="font-semibold text-slate-900">
                Digital Chain of Custody
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                RasoiGrid records key workflow events so administrators can
                review who performed an action, what was affected and when the
                event occurred. The audit trail supports accountability; it
                does not transfer food-safety responsibility away from
                authorized personnel.
              </p>
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search event, actor or reference..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "ALL",
                  "DONATION",
                  "CLAIM",
                  "HANDOVER",
                  "CLOSED",
                ] as const
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    filter === item
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item === "ALL"
                    ? "All"
                    : item.charAt(0) +
                      item.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit records */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Audit Events
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Administrative record of important system actions.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredRecords.map((record) => (
              <AuditRow
                key={record.id}
                record={record}
              />
            ))}

            {filteredRecords.length === 0 && (
              <div className="p-12 text-center">
                <FileCheck2 className="mx-auto h-10 w-10 text-slate-300" />

                <p className="mt-3 font-semibold text-slate-700">
                  {loadError
                    ? "Could not load the audit trail"
                    : isLoading
                      ? "Loading audit events…"
                      : auditRecords.length === 0
                        ? "No events yet"
                        : "No audit events found"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {loadError ||
                    (auditRecords.length === 0
                      ? "Events appear as donors list food and NGOs claim it."
                      : "Try changing your search or filter.")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Compliance controls */}
        <div className="grid gap-4 md:grid-cols-3">
          <ControlCard
            icon={<UserCheck className="h-5 w-5" />}
            title="Who Did It"
            description="Every event records the account that acted, or RasoiGrid itself for automatic expiry."
          />

          <ControlCard
            icon={<HeartHandshake className="h-5 w-5" />}
            title="Handover Records"
            description="Deliveries confirmed with the NGO's handover code say so in their details."
          />

          <ControlCard
            icon={<Recycle className="h-5 w-5" />}
            title="Food That Was Lost"
            description="Cancelled and expired donations are flagged so patterns can be spotted."
          />
        </div>

        {/* Governance note */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

            <div>
              <h3 className="font-semibold text-slate-900">
                Governance Principle
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Keep operational records reviewable and attributable.
                Verification, dispatch and handover actions should remain
                connected to the responsible participant and timestamp.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}

const Metric: React.FC<MetricProps> = ({
  icon,
  label,
  value,
  detail,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {detail}
      </p>
    </div>
  );
};

interface AuditRowProps {
  record: AuditRecord;
}

const AuditRow: React.FC<AuditRowProps> = ({ record }) => {
  const iconMap: Record<AuditType, React.ReactNode> = {
    DONATION: (
      <Recycle className="h-5 w-5 text-emerald-600" />
    ),
    CLAIM: (
      <Truck className="h-5 w-5 text-violet-600" />
    ),
    HANDOVER: (
      <HeartHandshake className="h-5 w-5 text-blue-600" />
    ),
    CLOSED: (
      <AlertTriangle className="h-5 w-5 text-amber-600" />
    ),
  };

  return (
    <div className="p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50">
            {iconMap[record.type]}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-slate-900">
                {record.action}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  record.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {record.status === "COMPLETED" ? "Done" : "Did not reach people"}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
              <span>
                Actor:{" "}
                <strong className="text-slate-700">
                  {record.actor}
                </strong>
              </span>

              <span>
                Role:{" "}
                <strong className="text-slate-700">
                  {record.actorRole}
                </strong>
              </span>

              <span>
                Ref:{" "}
                <strong className="text-slate-700">
                  {record.reference}
                </strong>
              </span>
            </div>

            {record.details && (
              <p className="mt-2 text-xs text-slate-500">{record.details}</p>
            )}

            <p className="mt-2 text-xs text-slate-400">
              {record.id} · {record.timestamp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ControlCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ControlCard: React.FC<ControlCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
};