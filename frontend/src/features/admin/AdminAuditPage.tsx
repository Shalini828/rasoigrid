import React, { useState } from "react";
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

type AuditType =
  | "VERIFICATION"
  | "HANDOVER"
  | "DISPATCH"
  | "RECOVERY"
  | "ACCESS";

interface AuditRecord {
  id: string;
  type: AuditType;
  action: string;
  actor: string;
  actorRole: string;
  reference: string;
  timestamp: string;
  status: "COMPLETED" | "REVIEW";
}

const auditRecords: AuditRecord[] = [
  {
    id: "AUD-1048",
    type: "HANDOVER",
    action: "Food handover verified",
    actor: "Volunteer V-204",
    actorRole: "VOLUNTEER",
    reference: "Mission MIS-7821",
    timestamp: "15 Sep 2026 · 10:18 AM",
    status: "COMPLETED",
  },
  {
    id: "AUD-1047",
    type: "VERIFICATION",
    action: "NGO verification completed",
    actor: "System Administrator",
    actorRole: "ADMIN",
    reference: "NGO-MH-20481",
    timestamp: "15 Sep 2026 · 09:42 AM",
    status: "COMPLETED",
  },
  {
    id: "AUD-1046",
    type: "DISPATCH",
    action: "Rescue mission dispatched",
    actor: "Mumbai Rescue Network",
    actorRole: "NGO",
    reference: "MIS-7821",
    timestamp: "15 Sep 2026 · 09:15 AM",
    status: "COMPLETED",
  },
  {
    id: "AUD-1045",
    type: "RECOVERY",
    action: "Organic recovery pathway selected",
    actor: "Recovery Coordinator",
    actorRole: "NGO",
    reference: "REC-4492",
    timestamp: "15 Sep 2026 · 08:56 AM",
    status: "COMPLETED",
  },
  {
    id: "AUD-1044",
    type: "ACCESS",
    action: "Role access change requested",
    actor: "System Administrator",
    actorRole: "ADMIN",
    reference: "USR-309",
    timestamp: "14 Sep 2026 · 06:31 PM",
    status: "REVIEW",
  },
];

export const AdminAuditPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | AuditType>("ALL");

  const filteredRecords = auditRecords.filter((record) => {
    const matchesSearch =
      record.action.toLowerCase().includes(search.toLowerCase()) ||
      record.actor.toLowerCase().includes(search.toLowerCase()) ||
      record.reference.toLowerCase().includes(search.toLowerCase());

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
            value="1,284"
            detail="Digital activity records"
          />

          <Metric
            icon={<UserCheck className="h-5 w-5 text-blue-600" />}
            label="Verified Handovers"
            value="426"
            detail="Human-confirmed transfers"
          />

          <Metric
            icon={<ShieldCheck className="h-5 w-5 text-violet-600" />}
            label="Compliance Reviews"
            value="38"
            detail="Completed this cycle"
          />

          <Metric
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
            label="Needs Review"
            value="3"
            detail="Administrative attention"
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
                  "VERIFICATION",
                  "HANDOVER",
                  "DISPATCH",
                  "RECOVERY",
                  "ACCESS",
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
                  No audit events found
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Compliance controls */}
        <div className="grid gap-4 md:grid-cols-3">
          <ControlCard
            icon={<UserCheck className="h-5 w-5" />}
            title="Identity Verification"
            description="Track authorized users and role-based access decisions."
          />

          <ControlCard
            icon={<HeartHandshake className="h-5 w-5" />}
            title="Handover Records"
            description="Maintain a traceable record of verified food transfers."
          />

          <ControlCard
            icon={<Recycle className="h-5 w-5" />}
            title="Recovery Records"
            description="Track non-edible organic material through recovery pathways."
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

        {/* Demo notice */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-400">
          Frontend demonstration data — audit records and compliance
          controls will connect to the backend audit service later.
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
    VERIFICATION: (
      <UserCheck className="h-5 w-5 text-emerald-600" />
    ),
    HANDOVER: (
      <HeartHandshake className="h-5 w-5 text-blue-600" />
    ),
    DISPATCH: (
      <Truck className="h-5 w-5 text-violet-600" />
    ),
    RECOVERY: (
      <Recycle className="h-5 w-5 text-amber-600" />
    ),
    ACCESS: (
      <ShieldCheck className="h-5 w-5 text-slate-600" />
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
                {record.status}
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

            <p className="mt-2 text-xs text-slate-400">
              {record.id} · {record.timestamp}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          View Record
        </button>
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