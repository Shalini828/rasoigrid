import React from "react";
import {
  BarChart3,
  CheckCircle2,
  HeartHandshake,
  Leaf,
  Recycle,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const monthlyImpact = [
  {
    month: "Apr",
    meals: 32000,
    recovery: 4500,
  },
  {
    month: "May",
    meals: 41800,
    recovery: 6200,
  },
  {
    month: "Jun",
    meals: 50700,
    recovery: 7900,
  },
  {
    month: "Jul",
    meals: 59300,
    recovery: 9300,
  },
  {
    month: "Aug",
    meals: 67100,
    recovery: 11200,
  },
  {
    month: "Sep",
    meals: 74500,
    recovery: 13400,
  },
];

export const AdminImpactPage: React.FC = () => {
  const latest = monthlyImpact[monthlyImpact.length - 1];
  const previous = monthlyImpact[monthlyImpact.length - 2];

  const mealGrowth = Math.round(
    ((latest.meals - previous.meals) / previous.meals) * 100
  );

  const recoveryGrowth = Math.round(
    ((latest.recovery - previous.recovery) / previous.recovery) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <BarChart3 className="h-4 w-4" />
                ADMIN MISSION CONTROL
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                System Impact
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                A system-wide view of how RasoiGrid converts urban food
                surplus into community benefit and circular recovery.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4">
              <Leaf className="h-7 w-7 text-emerald-600" />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Impact Layer
                </p>

                <p className="text-lg font-bold text-slate-900">
                  People + Planet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ImpactMetric
            icon={<HeartHandshake className="h-5 w-5 text-emerald-600" />}
            label="Meals Supported"
            value="482,930"
            detail="Community distribution"
          />

          <ImpactMetric
            icon={<Recycle className="h-5 w-5 text-blue-600" />}
            label="Organic Recovery"
            value="34.7K kg"
            detail="Diverted from disposal"
          />

          <ImpactMetric
            icon={<Leaf className="h-5 w-5 text-violet-600" />}
            label="Estimated GHG Avoidance"
            value="425.8 t"
            detail="Planning estimate"
          />

          <ImpactMetric
            icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
            label="Diversion Rate"
            value="99.4%"
            detail="Current demonstration metric"
          />
        </div>

        {/* Impact split */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Six-Month Impact Trend
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Community meals supported and organic recovery volume.
                </p>
              </div>

              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="mt-8 space-y-5">
              {monthlyImpact.map((item) => (
                <div key={item.month}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="w-10 text-xs font-bold text-slate-500">
                      {item.month}
                    </span>

                    <div className="flex flex-1 items-center gap-3">
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${(item.meals / 75000) * 100}%`,
                          }}
                        />
                      </div>

                      <span className="w-20 text-right text-xs font-semibold text-slate-700">
                        {(item.meals / 1000).toFixed(1)}K meals
                      </span>
                    </div>
                  </div>

                  <div className="ml-10 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-400"
                        style={{
                          width: `${(item.recovery / 15000) * 100}%`,
                        }}
                      />
                    </div>

                    <span className="w-20 text-right text-[11px] text-slate-400">
                      {(item.recovery / 1000).toFixed(1)}K kg
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-5 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Meals supported
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                Organic recovery
              </div>
            </div>
          </div>

          {/* Growth */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Growth
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Change from the previous reporting period.
            </p>

            <div className="mt-7 space-y-4">
              <GrowthCard
                label="Meals supported"
                value={`+${mealGrowth}%`}
                icon={<Users className="h-5 w-5" />}
              />

              <GrowthCard
                label="Organic recovery"
                value={`+${recoveryGrowth}%`}
                icon={<Recycle className="h-5 w-5" />}
              />

              <GrowthCard
                label="Network participation"
                value="+18%"
                icon={<HeartHandshake className="h-5 w-5" />}
              />
            </div>

            <div className="mt-6 rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Direction
              </p>

              <p className="mt-1 text-sm font-bold text-slate-800">
                More surplus is being routed into recovery pathways.
              </p>
            </div>
          </div>
        </div>

        {/* Impact pathway */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              System Impact Pathway
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              How RasoiGrid creates measurable value across the urban food
              loop.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <PathwayCard
              icon={<HeartHandshake className="h-6 w-6" />}
              step="01"
              title="People First"
              value="482K+"
              description="Meals supported through coordinated surplus redistribution."
            />

            <PathwayCard
              icon={<Recycle className="h-6 w-6" />}
              step="02"
              title="Circular Recovery"
              value="34.7K kg"
              description="Organic material directed toward appropriate recovery pathways."
            />

            <PathwayCard
              icon={<Leaf className="h-6 w-6" />}
              step="03"
              title="Landfill Last"
              value="425.8 t"
              description="Estimated greenhouse-gas avoidance from recovered material."
            />
          </div>
        </div>

        {/* Governance + methodology */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />

              <h2 className="text-lg font-bold text-slate-900">
                Impact Methodology
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <MethodItem
                title="Digital weight capture"
                description="Record reported surplus and recovery quantities at workflow checkpoints."
              />

              <MethodItem
                title="Pathway tracking"
                description="Connect eligible food redistribution with downstream organic recovery outcomes."
              />

              <MethodItem
                title="Transparent estimates"
                description="Impact calculations are planning estimates and should not be presented as independent certification."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />

              <h2 className="text-lg font-bold text-slate-900">
                System Reporting
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              <ReportRow
                label="Donation events recorded"
                value="1,284"
              />

              <ReportRow
                label="Verified handovers"
                value="426"
              />

              <ReportRow
                label="Recovery events"
                value="318"
              />

              <ReportRow
                label="Active network participants"
                value="91"
              />
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Prepare Impact Report
            </button>
          </div>
        </div>

        {/* Principle */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                RasoiGrid Impact Principle
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                People First → Circular Recovery → Landfill Last
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                The system measures success not only by how much food is
                diverted, but by how much value is recovered for people and
                the environment.
              </p>
            </div>

            <Leaf className="hidden h-14 w-14 text-emerald-300 md:block" />
          </div>
        </div>

        {/* Demo notice */}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-400">
          Frontend demonstration data — system impact metrics will connect to
          the backend impact and reporting services later.
        </div>
      </div>
    </div>
  );
};

interface ImpactMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}

const ImpactMetric: React.FC<ImpactMetricProps> = ({
  icon,
  label,
  value,
  detail,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
        {icon}
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

interface GrowthCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const GrowthCard: React.FC<GrowthCardProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-600">
          {icon}
        </div>

        <span className="text-lg font-bold text-emerald-600">
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Compared with previous period
      </p>
    </div>
  );
};

interface PathwayCardProps {
  icon: React.ReactNode;
  step: string;
  title: string;
  value: string;
  description: string;
}

const PathwayCard: React.FC<PathwayCardProps> = ({
  icon,
  step,
  title,
  value,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-widest text-emerald-600">
          {step}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
};

interface MethodItemProps {
  title: string;
  description: string;
}

const MethodItem: React.FC<MethodItemProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

interface ReportRowProps {
  label: string;
  value: string;
}

const ReportRow: React.FC<ReportRowProps> = ({
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
};