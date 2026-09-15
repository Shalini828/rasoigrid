import React, { useEffect, useState } from 'react';

import {
  HeartHandshake,
  MapPin,
  Phone,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import type { ReceiverHub } from '../../core/types/models';
import { api } from '../../core/api/client';

export const ReceiverHubPage: React.FC = () => {
  const [hubs, setHubs] = useState<ReceiverHub[]>([]);
  const [filter, setFilter] = useState<
    'all' | 'urgent_shortage' | 'normal'
  >('all');

  useEffect(() => {
    api.getReceiverHubs().then(setHubs);
  }, []);

  const filteredHubs = hubs.filter(
    (h) => filter === 'all' || h.urgencyLevel === filter
  );

  const urgentCount = hubs.filter(
    (h) => h.urgencyLevel === 'urgent_shortage'
  ).length;

  const totalCapacity = hubs.reduce(
    (sum, hub) => sum + hub.dailyCapacityMeals,
    0
  );

  const totalCurrentIntake = hubs.reduce(
    (sum, hub) => sum + hub.currentIntakeMeals,
    0
  );

  const overallUtilization =
    totalCapacity > 0
      ? Math.round((totalCurrentIntake / totalCapacity) * 100)
      : 0;

  return (
    <div className="space-y-6 text-slate-800">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-5 border-b border-slate-200">

        <div>
          <div className="flex items-center gap-2 mb-2">

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-bold tracking-wide">
              <HeartHandshake className="w-3.5 h-3.5" />
              PEOPLE FIRST DISTRIBUTION
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              RECEIVER NETWORK ACTIVE
            </span>

          </div>

          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Shelter & Food Bank Intake Terminal
          </h1>

          <p className="text-sm text-slate-500 mt-2 max-w-4xl leading-relaxed">
            Coordinate eligible food surplus toward verified urban
            shelters, community kitchens, food banks and other
            authorized receiving organizations.
          </p>
        </div>

        {/* Beneficiary indicator */}
        <div className="shrink-0">

          <div className="px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm">

            <div className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
              Verified Beneficiaries
            </div>

            <div className="flex items-center gap-2 mt-1">

              <Users className="w-4 h-4 text-emerald-500" />

              <span className="text-xl font-bold text-slate-900">
                65,400+
              </span>

              <span className="text-[11px] font-semibold text-emerald-600">
                Network
              </span>

            </div>

          </div>

        </div>
      </div>


      {/* =========================================================
          METRICS
      ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <MetricTile
          label="Registered Partner Hubs"
          value={String(hubs.length || 48)}
          unit="Shelters"
          delta="Mumbai Metro Area"
          theme="emerald"
          icon={Users}
        />

        <MetricTile
          label="Daily Meal Capacity"
          value="3,050"
          unit="Meals / day"
          delta={`${overallUtilization || 84}% utilization`}
          theme="cyan"
          icon={HeartHandshake}
        />

        <MetricTile
          label="Urgent Deficit Hotspots"
          value={String(urgentCount || 2)}
          unit="Hubs"
          delta="Shortage requires priority routing"
          theme="coral"
          icon={AlertTriangle}
        />

        <MetricTile
          label="Average Intake Time"
          value="8.2"
          unit="Mins"
          delta="Fast contactless sign-off"
          theme="indigo"
          icon={Clock}
        />

      </div>


      {/* =========================================================
          NETWORK STATUS STRIP
      ========================================================= */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm px-5 py-4">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-widest font-mono text-slate-400">
                DISTRIBUTION NETWORK
              </div>

              <h2 className="text-base font-bold text-slate-900">
                People-first receiver coordination
              </h2>
            </div>

          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">

            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Normal intake
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Urgent shortage
            </div>

            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              High utilization
            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          FILTER TABS
      ========================================================= */}
      <div className="flex flex-wrap items-center gap-2">

        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
            filter === 'all'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          All Distribution Hubs ({hubs.length})
        </button>

        <button
          onClick={() => setFilter('urgent_shortage')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
            filter === 'urgent_shortage'
              ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          Urgent Shortage ({urgentCount})
        </button>

        <button
          onClick={() => setFilter('normal')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
            filter === 'normal'
              ? 'bg-cyan-50 text-cyan-700 border-cyan-200 shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          Normal Intake ({hubs.length - urgentCount})
        </button>

      </div>


      {/* =========================================================
          HUB CARDS
      ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {filteredHubs.map((hub) => {

          const rawPercent =
            hub.dailyCapacityMeals > 0
              ? Math.round(
                  (hub.currentIntakeMeals /
                    hub.dailyCapacityMeals) *
                    100
                )
              : 0;

          const capacityPercent = Math.min(
            Math.max(rawPercent, 0),
            100
          );

          const isUrgent =
            hub.urgencyLevel === 'urgent_shortage';

          const isHighCapacity = capacityPercent >= 90;

          return (

            <GlassCard
              key={hub.id}
              glow="none"
              className={`!bg-white !border-slate-200 !shadow-sm p-5 space-y-5 hover:!shadow-md transition-all ${
                isUrgent
                  ? 'hover:!border-rose-200'
                  : 'hover:!border-emerald-200'
              }`}
            >

              {/* Top status */}
              <div className="flex items-center justify-between gap-3">

                <span
                  className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border ${
                    isUrgent
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {isUrgent ? (
                    <>
                      <AlertTriangle className="w-3 h-3" />
                      URGENT FOOD SHORTAGE
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      ACTIVE INTAKE NORMAL
                    </>
                  )}
                </span>

                <span className="text-[11px] font-mono font-semibold text-slate-400">
                  {hub.id}
                </span>

              </div>


              {/* Hub identity */}
              <div>

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {hub.name}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">

                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />

                      {hub.location.address} ({hub.location.neighborhood})

                    </p>

                  </div>

                  <div className="hidden sm:flex w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 items-center justify-center shrink-0">

                    <HeartHandshake className="w-4 h-4 text-emerald-600" />

                  </div>

                </div>

              </div>


              {/* Capacity panel */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                <div className="flex items-center justify-between gap-3 mb-2">

                  <div>

                    <span className="block text-[10px] uppercase tracking-wider font-mono text-slate-400">
                      Intake Fill Rate
                    </span>

                    <span className="text-sm font-bold text-slate-800">
                      Current daily capacity
                    </span>

                  </div>

                  <span
                    className={`text-sm font-mono font-bold ${
                      isUrgent
                        ? 'text-rose-600'
                        : isHighCapacity
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {capacityPercent}%
                  </span>

                </div>

                <div className="flex justify-between items-center text-xs mb-2">

                  <span className="text-slate-500">
                    Meals received
                  </span>

                  <span className="font-mono font-bold text-slate-700">
                    {hub.currentIntakeMeals} /{' '}
                    {hub.dailyCapacityMeals}
                  </span>

                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUrgent
                        ? 'bg-rose-500'
                        : isHighCapacity
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${capacityPercent}%`,
                    }}
                  />

                </div>

                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-400">

                  <span>
                    {isUrgent
                      ? 'Priority receiver'
                      : 'Receiving surplus'}
                  </span>

                  <span>
                    {Math.max(
                      hub.dailyCapacityMeals -
                        hub.currentIntakeMeals,
                      0
                    )}{' '}
                    meals remaining
                  </span>

                </div>

              </div>


              {/* Dietary protocols */}
              <div>

                <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-slate-400">
                  Accepted Dietary Protocols
                </span>

                <div className="flex flex-wrap gap-2 mt-2">

                  {hub.acceptedDietary.map((diet) => (

                    <span
                      key={diet}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold capitalize"
                    >
                      {diet.replace('_', ' ')}
                    </span>

                  ))}

                </div>

              </div>


              {/* Coordinator footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                <div>

                  <span className="block text-[10px] uppercase tracking-wider font-mono text-slate-400">
                    Coordinator
                  </span>

                  <span className="text-sm text-slate-800 font-semibold">
                    {hub.contactPerson}
                  </span>

                </div>

                <a
                  href={`tel:${hub.contactPhone}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Hub</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>

              </div>

            </GlassCard>

          );
        })}

      </div>


      {/* =========================================================
          EMPTY STATE
      ========================================================= */}
      {filteredHubs.length === 0 && (

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-10 text-center">

          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">

            <HeartHandshake className="w-6 h-6 text-slate-400" />

          </div>

          <h3 className="text-base font-bold text-slate-900 mt-4">
            No receiver hubs found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            There are currently no hubs matching this filter.
          </p>

        </div>

      )}


      {/* =========================================================
          FOOTER PRINCIPLE
      ========================================================= */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-cyan-50 border border-emerald-100 p-5">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center">

              <HeartHandshake className="w-5 h-5 text-emerald-600" />

            </div>

            <div>

              <div className="text-[10px] uppercase tracking-widest font-mono font-bold text-emerald-600">
                PEOPLE FIRST PROTOCOL
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Eligible surplus moves toward verified receivers first.
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Receiver capacity and urgency help RasoiGrid prioritize
                coordination. Final food-safety decisions remain with
                authorized personnel and receiving organizations.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 shrink-0">

            <span className="px-3 py-2 rounded-lg bg-white border border-emerald-200 text-xs font-semibold text-emerald-700">
              Verify
            </span>

            <span className="text-slate-300">→</span>

            <span className="px-3 py-2 rounded-lg bg-white border border-cyan-200 text-xs font-semibold text-cyan-700">
              Coordinate
            </span>

            <span className="text-slate-300">→</span>

            <span className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600">
              Receive
            </span>

          </div>

        </div>

      </div>

    </div>
  );
};