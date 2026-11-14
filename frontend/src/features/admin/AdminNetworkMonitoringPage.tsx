import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Radio,
  Recycle,
  Truck,
  Users,
  AlertTriangle,
} from "lucide-react";

type NetworkStatus = "ONLINE" | "ATTENTION" | "OFFLINE";

interface NetworkNode {
  name: string;
  type: string;
  location: string;
  status: NetworkStatus;
  activity: string;
  metric: string;
}

import { api } from "../../core/api/client";
import type { AdminOverviewDTO } from "../../core/api/types";

const pct = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 100) : null;

const pctLabel = (value: number | null) => (value === null ? "No data yet" : `${value}%`);

const buildNodes = (o: AdminOverviewDTO): NetworkNode[] => [
  {
    name: "Donors",
    type: "Restaurants, caterers and canteens",
    location: "All registered donors",
    status: o.users.donors > 0 ? "ONLINE" : "OFFLINE",
    activity: `${o.users.donors} donors · ${o.donations.total} donations listed`,
    metric: `${o.donations.available} waiting for an NGO`,
  },
  {
    name: "NGOs",
    type: "Rescue and distribution partners",
    location: "Verified by admins",
    status: o.ngos.verified > 0 ? (o.ngos.pending > 0 ? "ATTENTION" : "ONLINE") : "OFFLINE",
    activity: `${o.ngos.verified} verified · ${o.ngos.pending} pending`,
    metric: `${o.donations.claimed + o.donations.in_transit} donations being collected`,
  },
  {
    name: "Volunteers",
    type: "Pickup and delivery",
    location: "Field network",
    status: o.volunteers.on_duty > 0 ? "ONLINE" : o.users.volunteers > 0 ? "ATTENTION" : "OFFLINE",
    activity: `${o.volunteers.on_duty} on duty · ${o.volunteers.busy_or_off} busy or off`,
    metric: `${o.dispatches.delivered} deliveries completed`,
  },
];

export const AdminNetworkMonitoringPage: React.FC = () => {
  const [overview, setOverview] = useState<AdminOverviewDTO | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getAdminOverview()
      .then((data) => {
        if (!cancelled) setOverview(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Could not load network figures.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const o = overview;
  const liveDonations = o ? o.donations.total - o.donations.cancelled : 0;
  const liveDispatches = o ? o.dispatches.waiting_for_volunteer + o.dispatches.assigned + o.dispatches.picked_up + o.dispatches.delivered : 0;
  const activePickups = o ? o.dispatches.waiting_for_volunteer + o.dispatches.assigned + o.dispatches.picked_up : 0;

  const claimedRate = o ? pct(o.donations.claimed + o.donations.in_transit + o.donations.delivered, liveDonations) : null;
  const staffedRate = o ? pct(o.dispatches.assigned + o.dispatches.picked_up + o.dispatches.delivered, liveDispatches) : null;
  const completedRate = o ? pct(o.dispatches.delivered, liveDispatches) : null;
  const deliveryRate = o?.delivery_rate_percent ?? null;

  const alerts: { title: string; description: string; level: "URGENT" | "ATTENTION" | "REVIEW" }[] = [];
  if (o && o.dispatches.waiting_for_volunteer > 0) {
    alerts.push({
      title: `${o.dispatches.waiting_for_volunteer} pickups`,
      description: "Claimed but no volunteer was free",
      level: "URGENT",
    });
  }
  if (o && o.donations.expired > 0) {
    alerts.push({
      title: `${o.donations.expired} donations expired`,
      description: "Nobody claimed them in time",
      level: "ATTENTION",
    });
  }
  if (o && o.ngos.pending > 0) {
    alerts.push({
      title: `${o.ngos.pending} NGO applications`,
      description: "Awaiting verification",
      level: "REVIEW",
    });
  }

  const networkNodes = o ? buildNodes(o) : [];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <Radio className="h-4 w-4" />
                ADMIN MISSION CONTROL
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Network Monitoring
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor the health of the RasoiGrid food-rescue network,
                including rescue partners, volunteers, receiver hubs and
                circular recovery pathways.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4">
              <Activity className="h-7 w-7 text-emerald-600" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Network Status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                  <p className="text-lg font-bold text-slate-900">
                    {loadError ? "Unavailable" : o ? (alerts.some((a) => a.level === "URGENT") ? "Needs attention" : "Operational") : "Loading…"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loadError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {loadError}
          </p>
        )}

        {/* Top metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<HeartHandshake className="h-5 w-5 text-emerald-600" />}
            label="Food Waiting"
            value={o ? String(o.donations.available) : "—"}
            detail="Donations no NGO has claimed yet"
          />

          <MetricCard
            icon={<Truck className="h-5 w-5 text-blue-600" />}
            label="Pickups In Progress"
            value={o ? String(activePickups) : "—"}
            detail="Claimed and not yet delivered"
          />

          <MetricCard
            icon={<Building2 className="h-5 w-5 text-violet-600" />}
            label="Verified NGOs"
            value={o ? String(o.ngos.verified) : "—"}
            detail="Able to claim food"
          />

          <MetricCard
            icon={<Recycle className="h-5 w-5 text-amber-600" />}
            label="Volunteers On Duty"
            value={o ? String(o.volunteers.on_duty) : "—"}
            detail="Free for a pickup now"
          />
        </div>

        {/* Live overview */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Network health */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Network Health
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current operational state across major system layers.
                </p>
              </div>

              <Activity className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="mt-6 space-y-5">
              <HealthRow
                label="Donations claimed"
                value={pctLabel(claimedRate)}
                percent={claimedRate}
                description="Listed food that an NGO took on (cancelled ones left out)"
              />

              <HealthRow
                label="Pickups with a volunteer"
                value={pctLabel(staffedRate)}
                percent={staffedRate}
                description="Pickups that got a volunteer assigned"
                attention={staffedRate !== null && staffedRate < 80}
              />

              <HealthRow
                label="Pickups delivered"
                value={pctLabel(completedRate)}
                percent={completedRate}
                description="Pickups that reached the NGO"
              />

              <HealthRow
                label="Delivered rather than expired"
                value={pctLabel(deliveryRate)}
                percent={deliveryRate}
                description="Of donations that were delivered or expired"
                attention={deliveryRate !== null && deliveryRate < 80}
              />
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  System Alerts
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Items requiring attention.
                </p>
              </div>

              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>

            <div className="mt-6 space-y-3">
              {alerts.map((alert) => (
                <AlertItem
                  key={alert.title}
                  title={alert.title}
                  description={alert.description}
                  level={alert.level}
                />
              ))}

              {o && alerts.length === 0 && (
                <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
                  Nothing needs attention right now.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Network nodes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Network Participants
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Operational view of major RasoiGrid network participants.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Live figures
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {networkNodes.map((node) => (
              <NetworkNodeCard
                key={node.name}
                node={node}
              />
            ))}
          </div>
        </div>

        {/* Flow monitoring */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Urban Food Loop
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              System-wide visibility from surplus intake to final recovery.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-5">
            <FlowStep
              number="01"
              icon={<ArrowDownToLine className="h-5 w-5" />}
              title="Surplus"
              detail="Food reported"
            />

            <FlowConnector />

            <FlowStep
              number="02"
              icon={<HeartHandshake className="h-5 w-5" />}
              title="People First"
              detail="Eligible food routed"
            />

            <FlowConnector />

            <FlowStep
              number="03"
              icon={<Recycle className="h-5 w-5" />}
              title="Recover"
              detail="Organic loop"
            />
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Operating Principle
            </p>

            <p className="mt-2 text-sm font-bold text-slate-700">
              People First → Circular Recovery → Landfill Last
            </p>
          </div>
        </div>

        {/* Monitoring note */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex gap-3">
            <ShieldIcon />

            <div>
              <h3 className="font-semibold text-slate-900">
                Administrative Monitoring
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                This dashboard gives administrators a system-level view of
                network activity. Operational decisions remain with the
                appropriate verified organizations, volunteers and authorized
                personnel.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
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

        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
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

interface HealthRowProps {
  label: string;
  value: string;
  /** 0-100 bar fill; null shows an empty bar. */
  percent: number | null;
  description: string;
  attention?: boolean;
}

const HealthRow: React.FC<HealthRowProps> = ({
  label,
  value,
  percent,
  description,
  attention = false,
}) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {label}
          </p>

          <p className="text-xs text-slate-400">
            {description}
          </p>
        </div>

        <span
          className={`text-sm font-bold ${
            attention
              ? "text-amber-600"
              : "text-emerald-600"
          }`}
        >
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${
            attention ? "bg-amber-400" : "bg-emerald-500"
          }`}
          style={{ width: `${percent ?? 0}%` }}
        />
      </div>
    </div>
  );
};

interface AlertItemProps {
  title: string;
  description: string;
  level: "URGENT" | "ATTENTION" | "REVIEW";
}

const AlertItem: React.FC<AlertItemProps> = ({
  title,
  description,
  level,
}) => {
  const levelClasses = {
    URGENT: "bg-red-50 text-red-700",
    ATTENTION: "bg-amber-50 text-amber-700",
    REVIEW: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${levelClasses[level]}`}
        >
          {level}
        </span>
      </div>
    </div>
  );
};

interface NetworkNodeCardProps {
  node: NetworkNode;
}

const NetworkNodeCard: React.FC<NetworkNodeCardProps> = ({
  node,
}) => {
  const statusClasses = {
    ONLINE: "bg-emerald-100 text-emerald-700",
    ATTENTION: "bg-amber-100 text-amber-700",
    OFFLINE: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
            <Building2 className="h-5 w-5 text-slate-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              {node.name}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {node.type}
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[node.status]}`}
        >
          {node.status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <MapPin className="h-3.5 w-3.5" />
        {node.location}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Activity
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {node.activity}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            Performance
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-700">
            {node.metric}
          </p>
        </div>
      </div>
    </div>
  );
};

interface FlowStepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
}

const FlowStep: React.FC<FlowStepProps> = ({
  number,
  icon,
  title,
  detail,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-[10px] font-bold tracking-widest text-emerald-600">
        {number}
      </p>

      <div className="mx-auto mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
        {icon}
      </div>

      <p className="mt-3 text-sm font-bold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {detail}
      </p>
    </div>
  );
};

const FlowConnector: React.FC = () => {
  return (
    <div className="hidden items-center justify-center md:flex">
      <div className="h-px w-full bg-slate-200" />
    </div>
  );
};

const ShieldIcon: React.FC = () => {
  return (
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
      <Users className="h-4 w-4 text-emerald-600" />
    </div>
  );
};