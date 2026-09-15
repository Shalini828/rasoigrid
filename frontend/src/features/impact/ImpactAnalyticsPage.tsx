import React from 'react';

import {
  BarChart3,
  Download,
  ShieldCheck,
  Flame,
  Utensils,
  Recycle,
  FileCheck2,
  Award,
  TrendingUp,
  Leaf,
  CheckCircle2,
} from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import { useRescueStore } from '../../stores/useRescueStore';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

export const ImpactAnalyticsPage: React.FC = () => {
  const { impactMetrics } = useRescueStore();

  const monthlyImpactData = [
    {
      month: 'Apr',
      mealsServed: 32000,
      circularKg: 4500,
      methaneKg: 2800,
    },
    {
      month: 'May',
      mealsServed: 41000,
      circularKg: 6200,
      methaneKg: 3400,
    },
    {
      month: 'Jun',
      mealsServed: 48000,
      circularKg: 7800,
      methaneKg: 4200,
    },
    {
      month: 'Jul',
      mealsServed: 54000,
      circularKg: 8900,
      methaneKg: 4900,
    },
    {
      month: 'Aug',
      mealsServed: 68000,
      circularKg: 11200,
      methaneKg: 5800,
    },
    {
      month: 'Sep (MTD)',
      mealsServed: 74500,
      circularKg: 13400,
      methaneKg: 6900,
    },
  ];

  const totalMeals = impactMetrics?.totalMealsRecovered || 482930;
  const methaneAvoided = impactMetrics?.methaneAvoidedKg || 34770;
  const co2eAvoided = impactMetrics?.co2eAvoidedTons || 425.8;

  const handleExportReport = () => {
    alert('Generating board-ready ESG impact report...');
  };

  const handleCompliancePack = () => {
    alert('Preparing donation documentation pack...');
  };

  return (
    <div className="space-y-6 text-slate-800">

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-slate-200">

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              IMPACT & ESG LEDGER
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              RECOVERY DATA ACTIVE
            </span>

          </div>

          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            ESG & Impact Analytics
          </h1>

          <p className="text-sm text-slate-500 mt-2 max-w-4xl leading-relaxed">
            Track recovered meals, circular recovery, methane avoidance,
            and operational impact across the RasoiGrid food recovery network.
          </p>
        </div>

        {/* Export */}
        <button
          onClick={handleExportReport}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-mono shadow-sm transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT ESG REPORT</span>
        </button>

      </div>


      {/* =========================================================
          IMPACT SUMMARY STRIP
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Utensils className="w-4 h-4 text-emerald-600" />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                  HUMAN RECOVERY
                </div>

                <div className="text-sm font-bold text-slate-900">
                  Meals redirected
                </div>
              </div>

            </div>

            <TrendingUp className="w-4 h-4 text-emerald-500" />

          </div>

          <div className="text-2xl font-bold text-slate-900 mt-3">
            482K+
          </div>

          <div className="text-xs text-emerald-600 font-semibold mt-1">
            People-first recovery stream
          </div>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                <Flame className="w-4 h-4 text-cyan-600" />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                  METHANE AVOIDANCE
                </div>

                <div className="text-sm font-bold text-slate-900">
                  Organic diversion
                </div>
              </div>

            </div>

            <Leaf className="w-4 h-4 text-cyan-500" />

          </div>

          <div className="text-2xl font-bold text-slate-900 mt-3">
            34.7K kg
          </div>

          <div className="text-xs text-cyan-600 font-semibold mt-1">
            Planning estimate from recovery data
          </div>

        </div>


        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <Recycle className="w-4 h-4 text-amber-600" />
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                  CIRCULAR RECOVERY
                </div>

                <div className="text-sm font-bold text-slate-900">
                  Landfill diversion
                </div>
              </div>

            </div>

            <CheckCircle2 className="w-4 h-4 text-amber-500" />

          </div>

          <div className="text-2xl font-bold text-slate-900 mt-3">
            99.4%
          </div>

          <div className="text-xs text-amber-600 font-semibold mt-1">
            Current network target
          </div>

        </div>

      </div>


      {/* =========================================================
          METRIC TILES
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <MetricTile
          label="Total Meals Recovered"
          value={totalMeals}
          unit="Meals"
          delta="Social redistribution"
          theme="emerald"
          icon={Utensils}
        />

        <MetricTile
          label="Methane Avoided"
          value={methaneAvoided}
          unit="kg CH4"
          delta="Estimated avoidance"
          theme="cyan"
          icon={Flame}
        />

        <MetricTile
          label="GHG Impact Estimate"
          value={co2eAvoided}
          unit="Tons CO2e"
          delta="Calculated from recovery data"
          theme="indigo"
          icon={BarChart3}
        />

        <MetricTile
          label="Circular Diversion Rate"
          value="99.4"
          unit="%"
          delta="Target: 99.9% by Q4"
          theme="amber"
          icon={Recycle}
        />

      </div>


      {/* =========================================================
          CHART
      ========================================================= */}
      <GlassCard
        glow="none"
        className="!bg-white !border-slate-200 !shadow-sm p-6"
      >

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">

          <div>

            <div className="flex items-center gap-2">

              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </div>

              <div>

                <h3 className="font-bold text-slate-900 text-lg">
                  Monthly Food Recovery
                </h3>

                <p className="text-xs text-slate-500 mt-0.5">
                  Six-month recovery trajectory by destination stream
                </p>

              </div>

            </div>

          </div>

          {/* Chart legend summary */}
          <div className="flex flex-wrap gap-2 text-[10px] font-mono">

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Meals for People
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Circular Biomass
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-700">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              Methane Avoided
            </span>

          </div>

        </div>


        <div className="h-[360px] w-full">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart
              data={monthlyImpactData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
              barGap={4}
            >

              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={11}
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                fontFamily="monospace"
                tickLine={false}
                axisLine={false}
                width={55}
              />

              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                }}
                labelStyle={{
                  color: '#0f172a',
                  fontWeight: 700,
                  marginBottom: '6px',
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: '11px',
                  paddingTop: '16px',
                  color: '#64748b',
                  fontFamily: 'monospace',
                }}
              />

              <Bar
                dataKey="mealsServed"
                name="Meals for People"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
                maxBarSize={28}
              />

              <Bar
                dataKey="circularKg"
                name="Circular Biomass (kg)"
                fill="#f59e0b"
                radius={[5, 5, 0, 0]}
                maxBarSize={28}
              />

              <Bar
                dataKey="methaneKg"
                name="Methane Avoided (kg)"
                fill="#06b6d4"
                radius={[5, 5, 0, 0]}
                maxBarSize={28}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </GlassCard>


      {/* =========================================================
          METHODOLOGY + DOCUMENTATION
      ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Methodology */}
        <GlassCard
          glow="none"
          className="!bg-white !border-slate-200 !shadow-sm p-6"
        >

          <div className="flex items-start justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>

              <div>

                <div className="text-[10px] uppercase tracking-wider font-mono text-emerald-600 font-bold">
                  IMPACT METHODOLOGY
                </div>

                <h3 className="font-bold text-slate-900 text-lg">
                  GHG & Recovery Accounting
                </h3>

              </div>

            </div>

            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono font-semibold text-slate-500">
              AUDIT READY
            </span>

          </div>


          <p className="text-sm text-slate-500 leading-relaxed mt-4">
            RasoiGrid records recovered food quantities, destination
            pathways and circular diversion metrics to create a
            transparent impact trail.
          </p>


          <div className="space-y-3 mt-5">

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">

              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />

              <div>
                <div className="text-xs font-bold text-slate-800">
                  Digital weight capture
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">
                  Recovery quantities can be recorded at the donor
                  handover stage.
                </div>
              </div>

            </div>


            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">

              <CheckCircle2 className="w-4 h-4 text-cyan-500 mt-0.5 shrink-0" />

              <div>
                <div className="text-xs font-bold text-slate-800">
                  Recovery pathway tracking
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">
                  Food redirected to people and organic recovery can
                  be tracked separately.
                </div>
              </div>

            </div>


            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">

              <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />

              <div>
                <div className="text-xs font-bold text-slate-800">
                  Transparent impact estimates
                </div>

                <div className="text-[11px] text-slate-500 mt-0.5">
                  Environmental metrics are presented as planning
                  estimates rather than independent certification.
                </div>
              </div>

            </div>

          </div>

        </GlassCard>


        {/* Documentation */}
        <GlassCard
          glow="none"
          className="!bg-white !border-slate-200 !shadow-sm p-6"
        >

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-cyan-600" />
            </div>

            <div>

              <div className="text-[10px] uppercase tracking-wider font-mono text-cyan-600 font-bold">
                DONATION DOCUMENTATION
              </div>

              <h3 className="font-bold text-slate-900 text-lg">
                Compliance & Reporting Pack
              </h3>

            </div>

          </div>


          <p className="text-sm text-slate-500 leading-relaxed mt-4">
            Export structured donation and recovery records for
            organizational reporting, audit preparation and applicable
            statutory documentation.
          </p>


          <div className="grid grid-cols-2 gap-3 mt-5">

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">

              <div className="text-[10px] uppercase font-mono text-slate-400">
                RECORDS
              </div>

              <div className="text-lg font-bold text-slate-900 mt-1">
                1,284
              </div>

              <div className="text-[10px] text-slate-500">
                Donation events
              </div>

            </div>


            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">

              <div className="text-[10px] uppercase font-mono text-slate-400">
                REPORTING
              </div>

              <div className="text-lg font-bold text-emerald-600 mt-1">
                READY
              </div>

              <div className="text-[10px] text-slate-500">
                Export available
              </div>

            </div>

          </div>


          <button
            onClick={handleCompliancePack}
            className="w-full mt-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>DOWNLOAD DOCUMENTATION PACK</span>
          </button>

        </GlassCard>

      </div>


      {/* =========================================================
          BOTTOM IMPACT PRINCIPLE
      ========================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-cyan-50 border border-emerald-100 p-5">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Recycle className="w-5 h-5 text-emerald-600" />
            </div>

            <div>

              <div className="text-[10px] uppercase tracking-widest font-mono font-bold text-emerald-600">
                RASOIGRID IMPACT PRINCIPLE
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                People First → Circular Recovery → Landfill Last
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Every recovery decision is designed to maximize human
                benefit first and responsible organic recovery second.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2 shrink-0">

            <span className="px-3 py-2 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-700">
              PEOPLE
            </span>

            <span className="text-slate-300">
              →
            </span>

            <span className="px-3 py-2 rounded-lg bg-white border border-cyan-200 text-xs font-semibold text-cyan-700">
              RECOVER
            </span>

            <span className="text-slate-300">
              →
            </span>

            <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600">
              DIVERT
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};