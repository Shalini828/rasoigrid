import React, { useEffect, useState } from 'react';

import {
  Recycle,
  Flame,
  Zap,
  Leaf,
  MapPin,
  Factory,
  ArrowRight,
  Activity,
  Gauge,
} from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import type { CircularFacility } from '../../core/types/models';
import { api } from '../../core/api/client';

export const CircularRecoveryPage: React.FC = () => {
  const [facilities, setFacilities] = useState<CircularFacility[]>([]);

  useEffect(() => {
    api.getCircularFacilities().then(setFacilities);
  }, []);

  return (
    <div className="space-y-6 text-slate-800">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-slate-200">

        <div>
          <div className="flex items-center gap-2 mb-2">

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-50 text-lime-700 border border-lime-200 text-[11px] font-mono font-bold tracking-wide">
              <Recycle className="w-3.5 h-3.5" />
              CIRCULAR BIO-DIVERSION
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              RECOVERY NETWORK ACTIVE
            </span>

          </div>

          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Non-Edible Organic Loop & Biomethanation
          </h1>

          <p className="text-sm text-slate-500 mt-2 max-w-4xl leading-relaxed">
            Unavoidable organic material is directed toward appropriate
            recovery pathways such as composting, anaerobic digestion and
            other circular processing options instead of default disposal.
          </p>
        </div>

        <div className="shrink-0">
          <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
              Landfill Diversion Rate
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-4 h-4 text-emerald-500" />

              <span className="text-xl font-bold text-slate-900">
                99.4%
              </span>

              <span className="text-[11px] font-semibold text-emerald-600">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* =========================================================
          TOP METRICS
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <MetricTile
          label="Total Bio-Waste Diverted"
          value="48.2"
          unit="Tons"
          delta="100% spared from open landfills"
          theme="amber"
          icon={Recycle}
        />

        <MetricTile
          label="Clean Biogas Energy Generated"
          value="6,390"
          unit="kWh"
          delta="Powers 850 urban households"
          theme="cyan"
          icon={Zap}
        />

        <MetricTile
          label="Methane Flare Conversion"
          value="96.5"
          unit="%"
          delta="High efficiency methanation"
          theme="emerald"
          icon={Flame}
        />

        <MetricTile
          label="BSFL Insect Protein Yield"
          value="3.2"
          unit="Tons"
          delta="Sustainable aquaculture feed"
          theme="indigo"
          icon={Leaf}
        />

      </div>


      {/* =========================================================
          RECOVERY FLOW
      ========================================================= */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">

          <div>
            <div className="text-[10px] uppercase tracking-widest font-mono text-emerald-600 font-bold">
              RECOVERY PROTOCOL
            </div>

            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              Three circular recovery pathways
            </h2>
          </div>

          <div className="text-xs text-slate-500">
            People first → Circular recovery → Landfill last
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">

          {/* BIOGAS */}
          <div className="p-5 hover:bg-cyan-50/30 transition-colors">

            <div className="flex items-center justify-between mb-4">

              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-cyan-600" />
              </div>

              <span className="text-[10px] font-mono font-bold text-cyan-600">
                PATHWAY 01
              </span>

            </div>

            <h3 className="font-bold text-slate-900 text-base">
              Anaerobic Biogas Cogeneration
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed mt-2">
              High-volume kitchen preparation trimmings and
              high-moisture organic material can be directed toward
              sealed anaerobic digestion systems.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100">

              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700">
                <Zap className="w-3.5 h-3.5" />
                Clean energy + bio-fertilizer outputs
              </div>

            </div>

          </div>


          {/* BSFL */}
          <div className="p-5 hover:bg-amber-50/30 transition-colors">

            <div className="flex items-center justify-between mb-4">

              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-amber-600" />
              </div>

              <span className="text-[10px] font-mono font-bold text-amber-600">
                PATHWAY 02
              </span>

            </div>

            <h3 className="font-bold text-slate-900 text-base">
              Black Soldier Fly Larvae (BSFL)
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed mt-2">
              Suitable organic residues can be processed through
              controlled biological systems, producing useful biomass
              and organic residue for appropriate downstream use.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100">

              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                <Leaf className="w-3.5 h-3.5" />
                Protein biomass + organic residue
              </div>

            </div>

          </div>


          {/* COMPOST */}
          <div className="p-5 hover:bg-emerald-50/30 transition-colors">

            <div className="flex items-center justify-between mb-4">

              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Recycle className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-[10px] font-mono font-bold text-emerald-600">
                PATHWAY 03
              </span>

            </div>

            <h3 className="font-bold text-slate-900 text-base">
              Community Composting
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed mt-2">
              Decentralized composting systems can process appropriate
              vegetable trimmings and other organic material into
              useful soil-enriching compost.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100">

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <Leaf className="w-3.5 h-3.5" />
                Compost + soil enrichment
              </div>

            </div>

          </div>

        </div>
      </div>


      {/* =========================================================
          FACILITIES HEADER
      ========================================================= */}
      <div className="flex items-center justify-between">

        <div>

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-lime-50 border border-lime-100 flex items-center justify-center">
              <Factory className="w-4 h-4 text-lime-600" />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest font-mono text-slate-400">
                LIVE NETWORK
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Connected Circular Processing Units
              </h3>
            </div>

          </div>

        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <Gauge className="w-4 h-4 text-emerald-500" />
          Live utilization
        </div>

      </div>


      {/* =========================================================
          FACILITY CARDS
      ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {facilities.map((facility) => {

          const utilization =
            facility.dailyCapacityKg > 0
              ? Math.round(
                  (facility.currentTonnageKg /
                    facility.dailyCapacityKg) *
                    100
                )
              : 0;

          const safeUtilization = Math.min(
            Math.max(utilization, 0),
            100
          );

          return (

            <GlassCard
              key={facility.id}
              glow="none"
              className="!bg-white !border-slate-200 !shadow-sm p-5 space-y-5 hover:!shadow-md hover:!border-emerald-200 transition-all"
            >

              {/* Facility top row */}
              <div className="flex items-start justify-between gap-3">

                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">

                  <Factory className="w-3 h-3" />

                  {facility.type
                    .toUpperCase()
                    .replace(/\_/g, ' ')}

                </span>

                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg">

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                  {facility.methaneConversionEfficiency}%
                </span>

              </div>


              {/* Facility name */}
              <div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {facility.name}
                </h4>

                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">

                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />

                  {facility.location.neighborhood},{' '}
                  {facility.location.city}

                </p>

              </div>


              {/* Utilization */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                <div className="flex items-center justify-between gap-3 mb-2">

                  <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                    Current Intake
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-700">
                    {facility.currentTonnageKg} /{' '}
                    {facility.dailyCapacityKg} kg
                  </span>

                </div>

                <div className="flex items-center justify-between mb-2">

                  <span className="text-xs text-slate-500">
                    Daily processing utilization
                  </span>

                  <span
                    className={`text-xs font-bold ${
                      safeUtilization >= 90
                        ? 'text-rose-600'
                        : safeUtilization >= 70
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {safeUtilization}%
                  </span>

                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      safeUtilization >= 90
                        ? 'bg-rose-500'
                        : safeUtilization >= 70
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${safeUtilization}%`,
                    }}
                  />

                </div>

              </div>


              {/* Energy output */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">

                <div>

                  <span className="block text-[10px] uppercase tracking-wider font-mono text-slate-400">
                    Clean Energy Output
                  </span>

                  <span className="text-sm font-bold text-slate-800 mt-1 block">
                    {facility.energyGeneratedKwh.toLocaleString()} kWh
                  </span>

                </div>

                <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center">

                  <Zap className="w-4 h-4 text-cyan-600" />

                </div>

              </div>


              {/* Efficiency footer */}
              <div className="flex items-center justify-between text-xs">

                <span className="text-slate-400">
                  Conversion efficiency
                </span>

                <span className="font-semibold text-emerald-600">
                  {facility.methaneConversionEfficiency}%
                </span>

              </div>

            </GlassCard>

          );

        })}

      </div>


      {/* =========================================================
          BOTTOM RECOVERY PRINCIPLE
      ========================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-lime-50 border border-emerald-100 p-5">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center">

              <Recycle className="w-5 h-5 text-emerald-600" />

            </div>

            <div>

              <div className="text-[10px] uppercase tracking-widest font-mono font-bold text-emerald-600">
                RASOIGRID RECOVERY HIERARCHY
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                People first. Circular recovery second. Landfill last.
              </h3>

              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                AI supports prioritization and operational coordination.
                Final food-safety and receiving decisions remain with
                authorized human personnel and receiving organizations.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 shrink-0">

            <span className="px-3 py-2 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-700">
              People First
            </span>

            <ArrowRight className="w-4 h-4 text-slate-300" />

            <span className="px-3 py-2 rounded-lg bg-white border border-lime-200 text-xs font-semibold text-lime-700">
              Circular Recovery
            </span>

            <ArrowRight className="w-4 h-4 text-slate-300" />

            <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-500">
              Landfill Last
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};