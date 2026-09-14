import React, { useEffect, useState } from 'react';

import {
  Sparkles,
  TrendingUp,
  CloudSun,
  Calendar,
  MapPin,
  AlertCircle,
  Layers,
  Cpu,
  ArrowUpRight,
  Clock3,
  ShieldCheck,
  Zap,
} from 'lucide-react';

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';

import { ConfidenceScore } from '../../components/ui/ConfidenceScore';
import type { ForecastPrediction } from '../../core/types/models';
import { api } from '../../core/api/client';

export const ForecastPage: React.FC = () => {
  const [predictions, setPredictions] = useState<ForecastPrediction[]>([]);

  useEffect(() => {
    api.getForecastPredictions().then((data) => {
      setPredictions(data);
    });
  }, []);

  const hourlyForecastData = [
    {
      hour: '12:00',
      predictedSurplus: 130,
      demandKg: 190,
    },
    {
      hour: '14:00',
      predictedSurplus: 280,
      demandKg: 250,
    },
    {
      hour: '16:00',
      predictedSurplus: 110,
      demandKg: 160,
    },
    {
      hour: '18:00',
      predictedSurplus: 195,
      demandKg: 280,
    },
    {
      hour: '20:00',
      predictedSurplus: 410,
      demandKg: 340,
    },
    {
      hour: '22:00',
      predictedSurplus: 560,
      demandKg: 290,
    },
    {
      hour: '00:00',
      predictedSurplus: 230,
      demandKg: 110,
    },
  ];

  return (
    <div className="min-h-full bg-[#f5f8f6] text-[#102a43]">
      <div className="mx-auto max-w-[1500px] space-y-5">

        {/* =========================================================
            PAGE HEADER
        ========================================================= */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] lg:px-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-indigo-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI FORECAST ENGINE
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  MODEL ACTIVE
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#102a43] sm:text-3xl">
                AI Surplus & Hunger Prediction
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Anticipate where food surplus may appear, understand community
                demand, and prepare recovery capacity before surplus becomes waste.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-500" />

                  <span className="text-xs font-medium text-slate-500">
                    Model accuracy
                  </span>

                  <span className="text-sm font-bold text-emerald-600">
                    96.4%
                  </span>
                </div>

                <div className="mt-1 text-[10px] text-slate-400">
                  Current forecasting cycle
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            KPI CARDS
        ========================================================= */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Predicted surplus */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Predicted next 24h surplus
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#102a43]">
                    1,580
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    kg
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +14% vs average week
            </div>
          </div>

          {/* Fleet */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Pre-positioned EV fleets
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#102a43]">
                    12
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    vans
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600">
                <MapPin className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-600">
              <Zap className="h-3.5 w-3.5" />
              Optimized staging nodes
            </div>
          </div>

          {/* Demand */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Demand deficit zones
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#102a43]">
                    3
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    hotspots
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-rose-50 p-2.5 text-rose-500">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 text-xs font-semibold text-rose-500">
              Kurla · Dharavi · Malad
            </div>
          </div>

          {/* Weather */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Weather risk index
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#102a43]">
                    Low
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    31°C
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CloudSun className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 text-xs font-semibold text-emerald-600">
              Normal thermal conditions
            </div>
          </div>
        </section>

        {/* =========================================================
            MAIN FORECAST AREA
        ========================================================= */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">

          {/* CHART */}
          <div className="xl:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

            <div className="border-b border-slate-100 px-5 py-5 lg:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <TrendingUp className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#102a43]">
                        Surplus vs Community Demand
                      </h2>

                      <p className="text-xs text-slate-500">
                        24-hour urban food-flow forecast
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    Predicted surplus
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    Community demand
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[330px] px-3 pb-5 pt-4 sm:px-5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hourlyForecastData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="forecastSurplusGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#06b6d4"
                        stopOpacity={0.22}
                      />

                      <stop
                        offset="100%"
                        stopColor="#06b6d4"
                        stopOpacity={0.02}
                      />
                    </linearGradient>

                    <linearGradient
                      id="forecastDemandGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                        stopOpacity={0.18}
                      />

                      <stop
                        offset="100%"
                        stopColor="#6366f1"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="hour"
                    tick={{
                      fill: '#64748b',
                      fontSize: 11,
                    }}
                    axisLine={{
                      stroke: '#e2e8f0',
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fill: '#64748b',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 8px 24px rgba(15,23,42,0.10)',
                      fontSize: '12px',
                    }}
                    labelStyle={{
                      color: '#334155',
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="predictedSurplus"
                    name="Predicted surplus"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="url(#forecastSurplusGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: '#ffffff',
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="demandKg"
                    name="Community demand"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#forecastDemandGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      strokeWidth: 2,
                      fill: '#ffffff',
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock3 className="h-3.5 w-3.5 text-slate-400" />

                <span>
                  Forecast window: Today 12:00 → Tomorrow 00:00 IST
                </span>
              </div>
            </div>
          </div>

          {/* MODEL SIGNALS */}
          <div className="xl:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">

            <div className="border-b border-slate-100 px-5 py-5">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <Sparkles className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#102a43]">
                    Model Signals
                  </h2>

                  <p className="text-xs text-slate-500">
                    Factors influencing today's forecast
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5">

              {/* Signal 1 */}
              <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-700">
                    <Calendar className="h-4 w-4" />
                    Wedding Season Peak
                  </div>

                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-cyan-700 shadow-sm">
                    +28%
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  54 major banquet reservations registered across the
                  Dadar and Andheri corridor tonight.
                </p>
              </div>

              {/* Signal 2 */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                    <Layers className="h-4 w-4" />
                    Corporate Tech Shift
                  </div>

                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-indigo-700 shadow-sm">
                    +15%
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Quarter-end night catering activity is increasing
                  expected surplus around BKC.
                </p>
              </div>

              {/* Signal 3 */}
              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                    <CloudSun className="h-4 w-4" />
                    Micro-Climate
                  </div>

                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-emerald-700 shadow-sm">
                    LOW RISK
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Ambient conditions currently indicate normal thermal
                  degradation for planning purposes.
                </p>
              </div>

              {/* Model status */}
              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />

                  <span className="text-xs font-semibold text-slate-600">
                    Forecast engine active
                  </span>
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  V3.2
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            REGIONAL RECOMMENDATIONS
        ========================================================= */}
        <section>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">
                Regional intelligence
              </p>

              <h2 className="mt-1 text-lg font-bold text-[#102a43]">
                Pre-Routing Recommendations
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Areas where the system recommends preparing recovery capacity in advance.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              Mumbai urban network
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {predictions.map((pred) => (
              <div
                key={pred.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]"
              >
                {/* Card heading */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                      <MapPin className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#102a43]">
                        {pred.zone}
                      </h3>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Regional forecast zone
                      </p>
                    </div>
                  </div>

                  <ConfidenceScore
                    score={pred.confidencePercent}
                    size="sm"
                  />
                </div>

                {/* Metrics */}
                <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Time window
                    </span>

                    <span className="mt-1 block text-xs font-semibold text-slate-700">
                      {pred.timeWindow}
                    </span>
                  </div>

                  <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-3">
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Predicted
                    </span>

                    <span className="mt-1 block text-sm font-bold text-cyan-700">
                      {pred.predictedSurplusKg} kg
                    </span>
                  </div>

                  <div
                    className={`rounded-xl border p-3 ${
                      pred.demandMismatchRatio < 1
                        ? 'border-rose-100 bg-rose-50/60'
                        : 'border-emerald-100 bg-emerald-50/60'
                    }`}
                  >
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Demand
                    </span>

                    <span
                      className={`mt-1 block text-xs font-bold ${
                        pred.demandMismatchRatio < 1
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {pred.demandMismatchRatio < 1
                        ? 'High need'
                        : 'Surplus heavy'}
                    </span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        Pre-routing action
                      </span>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {pred.recommendedPreRouting}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state if API has no regional predictions */}
            {predictions.length === 0 && (
              <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>

                <h3 className="mt-3 text-sm font-bold text-[#102a43]">
                  Regional predictions are loading
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                  The forecast engine is preparing the latest zone-level
                  recommendations.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            BOTTOM PRINCIPLE
        ========================================================= */}
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2.5 text-emerald-600 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-emerald-900">
                  Forecasts support coordination — not food-safety certification.
                </h3>

                <p className="mt-0.5 text-xs text-emerald-700/80">
                  Final food-safety decisions remain with authorized human
                  personnel and receiving organizations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span>Predict</span>
              <span>→</span>
              <span>Route</span>
              <span>→</span>
              <span>Recover</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ForecastPage;