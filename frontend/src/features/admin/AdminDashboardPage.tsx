import React from "react";

import {
  ShieldCheck,
  Users,
  Building2,
  Truck,
  AlertTriangle,
  Activity,
  FileCheck2,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="min-h-full bg-[#f4f8f5] text-[#102a43]">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Mission Control
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Network operating normally
                </span>

              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#102a43] sm:text-3xl">
                RasoiGrid Admin Control
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Oversee the urban food recovery network, monitor participating
                organizations, review verification activity, and maintain
                system-wide operational visibility.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <Activity className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  System Status
                </p>

                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#102a43]">
                    Healthy
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* NETWORK METRICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            label="Registered Users"
            value="142"
            unit="network users"
            icon={<Users className="h-5 w-5" />}
            iconClass="bg-indigo-50 text-indigo-600 border-indigo-100"
          />

          <MetricCard
            label="Verified NGOs"
            value="27"
            unit="organizations"
            icon={<Building2 className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600 border-emerald-100"
          />

          <MetricCard
            label="Active Volunteers"
            value="38"
            unit="field operators"
            icon={<Truck className="h-5 w-5" />}
            iconClass="bg-cyan-50 text-cyan-600 border-cyan-100"
          />

          <MetricCard
            label="System Alerts"
            value="6"
            unit="need review"
            icon={<AlertTriangle className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-600 border-amber-100"
          />

        </section>

        {/* ADMIN CONTROL AREAS */}
        <section>

          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              Administrative controls
            </p>

            <h2 className="mt-1 text-lg font-extrabold text-[#102a43]">
              Network Governance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the health, participation and compliance of the RasoiGrid
              recovery network.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            <ControlCard
              icon={<Users className="h-5 w-5" />}
              title="User & Role Management"
              description="Review registered donors, NGOs and volunteers and monitor their assigned roles."
              status="Available"
            />

            <ControlCard
              icon={<Building2 className="h-5 w-5" />}
              title="NGO Verification"
              description="Review participating NGO organizations and their verification status."
              status="3 pending"
              warning
            />

            <ControlCard
              icon={<Activity className="h-5 w-5" />}
              title="Network Monitoring"
              description="Monitor recovery activity, active missions and operational network health."
              status="Live"
            />

            <ControlCard
              icon={<FileCheck2 className="h-5 w-5" />}
              title="Audit & Compliance"
              description="Review digital recovery records, handovers and operational audit activity."
              status="Ready"
            />

            <ControlCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="System Impact"
              description="Review system-wide recovery, people-first distribution and circular recovery outcomes."
              status="Live"
            />

            <ControlCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Security & Access"
              description="Maintain role-based access and ensure users only access authorized operations."
              status="Protected"
            />

          </div>

        </section>

        {/* SYSTEM ACTIVITY */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  System activity
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[#102a43]">
                  Operational overview
                </h3>
              </div>

              <Activity className="h-5 w-5 text-emerald-600" />

            </div>

            <div className="mt-5 space-y-3">

              <ActivityRow
                label="Recovery missions"
                value="18 active"
                status="normal"
              />

              <ActivityRow
                label="Priority alerts"
                value="6 require review"
                status="warning"
              />

              <ActivityRow
                label="Receiver network"
                value="27 active hubs"
                status="normal"
              />

              <ActivityRow
                label="Circular recovery"
                value="Operating"
                status="normal"
              />

            </div>

          </div>

          {/* GOVERNANCE PRINCIPLE */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
                  Governance principle
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[#102a43]">
                  Trust, visibility & control
                </h3>
              </div>

              <ShieldCheck className="h-5 w-5 text-indigo-600" />

            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Admin access exists to protect the recovery network, maintain
              appropriate permissions, review verification activity and
              preserve an auditable operational trail.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">

              <div className="rounded-xl bg-white px-3 py-3 text-center">
                <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                <p className="mt-2 text-[10px] font-bold text-slate-600">
                  Verify
                </p>
              </div>

              <div className="rounded-xl bg-white px-3 py-3 text-center">
                <Activity className="mx-auto h-4 w-4 text-indigo-600" />
                <p className="mt-2 text-[10px] font-bold text-slate-600">
                  Monitor
                </p>
              </div>

              <div className="rounded-xl bg-white px-3 py-3 text-center">
                <FileCheck2 className="mx-auto h-4 w-4 text-cyan-600" />
                <p className="mt-2 text-[10px] font-bold text-slate-600">
                  Audit
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* PRINCIPLES */}
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-5 py-5">

          <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-center sm:gap-6">

            <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700">
              People First
            </span>

            <ArrowUpRight className="hidden h-4 w-4 text-slate-300 sm:block" />

            <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-cyan-700">
              Circular Recovery
            </span>

            <ArrowUpRight className="hidden h-4 w-4 text-slate-300 sm:block" />

            <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-600">
              Landfill Last
            </span>

          </div>

        </section>

      </div>
    </div>
  );
};

/* =========================================================
   METRIC CARD
========================================================= */

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {label}
          </p>

          <div className="mt-3 flex items-baseline gap-1.5">

            <span className="text-3xl font-extrabold tracking-tight text-[#102a43]">
              {value}
            </span>

            <span className="text-xs font-semibold text-slate-400">
              {unit}
            </span>

          </div>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

/* =========================================================
   CONTROL CARD
========================================================= */

interface ControlCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  warning?: boolean;
}

const ControlCard: React.FC<ControlCardProps> = ({
  icon,
  title,
  description,
  status,
  warning,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-indigo-200">

      <div className="flex items-start justify-between gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${
            warning
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {status}
        </span>

      </div>

      <h3 className="mt-4 text-sm font-extrabold text-[#102a43]">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
};

/* =========================================================
   ACTIVITY ROW
========================================================= */

interface ActivityRowProps {
  label: string;
  value: string;
  status: "normal" | "warning";
}

const ActivityRow: React.FC<ActivityRowProps> = ({
  label,
  value,
  status,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

      <div className="flex items-center gap-2">

        <span
          className={`h-2 w-2 rounded-full ${
            status === "warning"
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
        />

        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>

      </div>

      <span
        className={`text-xs font-bold ${
          status === "warning"
            ? "text-amber-600"
            : "text-emerald-600"
        }`}
      >
        {value}
      </span>

    </div>
  );
};

export default AdminDashboardPage;