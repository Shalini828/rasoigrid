import React from 'react';

import {
  Truck,
  BatteryCharging,
  Thermometer,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Navigation,
  MapPin,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

import { StatusPill } from '../../components/ui/StatusPill';
import { useRescueStore } from '../../stores/useRescueStore';

export const LogisticsFleetPage: React.FC = () => {
  const { missionsList, verifyMissionDelivery } = useRescueStore();

  return (
    <div className="min-h-full bg-[#f4f8f5] text-[#102a43]">

      {/* =========================================================
          PAGE CONTAINER
      ========================================================== */}
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* =======================================================
            HEADER
        ======================================================== */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:px-7">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Heading */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">
                  <Truck className="h-3.5 w-3.5" />
                  Cold-Chain Fleet Logistics
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Fleet coordination active
                </span>

              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#102a43] sm:text-3xl">
                EV Fleet Dispatch & Route Optimizer
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Coordinate electric recovery vehicles, monitor cold-chain
                conditions, and maintain a clear handover path from surplus
                pickup to verified community delivery.
              </p>
            </div>

            {/* Fleet Battery */}
            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <BatteryCharging className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Fleet Battery Avg
                </p>

                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#102a43]">
                    84%
                  </span>

                  <span className="text-xs font-semibold text-emerald-600">
                    healthy
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* =======================================================
            TOP METRICS
        ======================================================== */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Active Fleet */}
          <MetricCard
            label="Active Fleet Units"
            value="28"
            unit="EVs & Cargo Vans"
            delta="100% zero-emission fleet"
            icon={<Truck className="h-5 w-5" />}
            iconClass="bg-cyan-50 text-cyan-600 border-cyan-100"
            valueClass="text-[#102a43]"
          />

          {/* Mission Time */}
          <MetricCard
            label="Average Mission Time"
            value="24.5"
            unit="mins"
            delta="18m faster than legacy logistics"
            icon={<Clock className="h-5 w-5" />}
            iconClass="bg-emerald-50 text-emerald-600 border-emerald-100"
            valueClass="text-[#102a43]"
          />

          {/* Compliance */}
          <MetricCard
            label="Cold-Chain Compliance"
            value="99.8"
            unit="%"
            delta="0 thermal breach incidents"
            icon={<Thermometer className="h-5 w-5" />}
            iconClass="bg-indigo-50 text-indigo-600 border-indigo-100"
            valueClass="text-[#102a43]"
          />

          {/* Completed */}
          <MetricCard
            label="Missions Completed Today"
            value="42"
            unit="rescues"
            delta="1,840 kg food saved"
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconClass="bg-amber-50 text-amber-600 border-amber-100"
            valueClass="text-[#102a43]"
          />

        </section>


        {/* =======================================================
            DISPATCH BOARD HEADER
        ======================================================== */}
        <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                <Navigation className="h-4 w-4 text-emerald-600" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Live coordination
                </p>

                <h2 className="text-lg font-extrabold text-[#102a43]">
                  Active Mission Dispatch Board
                </h2>
              </div>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              Monitor active recovery missions, vehicle telemetry and delivery
              verification.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {missionsList.length} missions in network
          </div>

        </section>


        {/* =======================================================
            MISSION GRID
        ======================================================== */}
        {missionsList.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

            {missionsList.map((mission) => (

              <article
                key={mission.id}
                className="group flex min-h-[470px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]"
              >

                {/* -------------------------------------------------
                    Mission Header
                -------------------------------------------------- */}
                <div className="border-b border-slate-100 px-5 py-4">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] font-bold text-slate-700">
                        {mission.code}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Recovery
                      </span>

                    </div>

                    <StatusPill
                      status={mission.status}
                      size="sm"
                    />

                  </div>

                  <div className="mt-4">

                    <h3 className="text-base font-extrabold leading-6 text-[#102a43]">
                      {mission.surplusItem?.foodName ||
                        'Cooked Surplus Batch'}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      From:{' '}
                      <span className="font-semibold text-slate-700">
                        {mission.surplusItem?.donorName}
                      </span>
                    </p>

                  </div>

                </div>


                {/* -------------------------------------------------
                    Route
                -------------------------------------------------- */}
                <div className="px-5 pt-5">

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex gap-3">

                      <div className="flex flex-col items-center">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>

                        <div className="my-1 h-7 w-px bg-slate-200" />

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                          <Navigation className="h-4 w-4 text-indigo-600" />
                        </div>

                      </div>


                      <div className="min-w-0 flex-1">

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            Pickup Origin
                          </p>

                          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {mission.surplusItem?.location.address}
                          </p>
                        </div>

                        <div className="mt-5">

                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            Delivery Hub
                          </p>

                          <p className="mt-1 text-xs font-bold text-indigo-700">
                            {mission.receiverName}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                {/* -------------------------------------------------
                    Driver + Temperature
                -------------------------------------------------- */}
                <div className="grid grid-cols-2 gap-3 px-5 pt-4">

                  {/* Driver */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3">

                    <div className="mb-2 flex items-center gap-1.5">

                      <Truck className="h-3.5 w-3.5 text-slate-400" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                        Driver & Vehicle
                      </span>

                    </div>

                    <p className="truncate text-xs font-bold text-[#102a43]">
                      {mission.driverName}
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-slate-500">
                      {mission.vehiclePlate}
                    </p>

                  </div>


                  {/* Temperature */}
                  <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">

                    <div className="mb-2 flex items-center gap-1.5">

                      <Thermometer className="h-3.5 w-3.5 text-cyan-600" />

                      <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                        Chamber Temp
                      </span>

                    </div>

                    <div className="flex items-center gap-1.5">

                      <span className="text-sm font-extrabold text-cyan-700">
                        {mission.currentTempCelsius}°C
                      </span>

                    </div>

                    <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                      Optimal range
                    </p>

                  </div>

                </div>


                {/* -------------------------------------------------
                    Mission Footer
                -------------------------------------------------- */}
                <div className="mt-auto px-5 pb-5 pt-4">

                  <div className="border-t border-slate-100 pt-4">

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
                          Estimated ETA
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">

                          <Clock className="h-3.5 w-3.5 text-emerald-600" />

                          <span className="font-mono text-sm font-extrabold text-emerald-600">
                            {mission.etaMinutes} mins
                          </span>

                        </div>

                      </div>


                      <a
                        href={`tel:${mission.driverPhone}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call Driver
                      </a>

                    </div>


                    {/* OTP Verification */}
                    {mission.status === 'in_transit' && (
                      <button
                        onClick={() =>
                          verifyMissionDelivery(
                            mission.id,
                            mission.otpCode
                          )
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#102a43] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#173f5f] hover:shadow-md"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-300" />

                        <span>
                          Verify Receiver OTP
                        </span>

                        <span className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-200">
                          {mission.otpCode}
                        </span>
                      </button>
                    )}

                  </div>

                </div>

              </article>

            ))}

          </div>
        ) : (

          /* =====================================================
             EMPTY STATE
          ====================================================== */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <Truck className="h-7 w-7 text-emerald-600" />
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-[#102a43]">
              No active missions
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Fleet units are currently available for the next eligible food
              recovery mission.
            </p>

          </div>

        )}


        {/* =======================================================
            FLEET OPERATIONS SUMMARY
        ======================================================== */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Fleet readiness */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Fleet readiness
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[#102a43]">
                  28 active units
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                <Zap className="h-5 w-5 text-cyan-600" />
              </div>

            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[84%] rounded-full bg-emerald-500" />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400">
              <span>Battery readiness</span>
              <span className="text-emerald-600">84%</span>
            </div>

          </div>


          {/* Cold-chain */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Cold-chain
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[#102a43]">
                  99.8% compliant
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                <Thermometer className="h-5 w-5 text-cyan-600" />
              </div>

            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5">

              <CheckCircle2 className="h-4 w-4 text-emerald-600" />

              <span className="text-xs font-semibold text-emerald-700">
                No thermal breach incidents
              </span>

            </div>

          </div>


          {/* Digital handover */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Digital handover
                </p>

                <h3 className="mt-1 text-lg font-extrabold text-[#102a43]">
                  Verified recovery flow
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
              </div>

            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold">

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                Pickup
              </span>

              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300" />

              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
                Transit
              </span>

              <ArrowUpRight className="h-3.5 w-3.5 text-slate-300" />

              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-700">
                Handover
              </span>

            </div>

          </div>

        </section>


        {/* =======================================================
            FOOTER NOTE
        ======================================================== */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-center text-xs text-emerald-800">

          <span className="font-bold">
            RasoiGrid fleet principle:
          </span>{' '}
          coordinate eligible food recovery efficiently while keeping final
          food-safety and handover decisions with authorized personnel and
          receiving organizations.

        </div>

      </div>
    </div>
  );
};


/* ===============================================================
   METRIC CARD
================================================================ */

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  delta: string;
  icon: React.ReactNode;
  iconClass: string;
  valueClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  delta,
  icon,
  iconClass,
  valueClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            {label}
          </p>

          <div className="mt-3 flex items-baseline gap-1.5">

            <span
              className={`text-3xl font-extrabold tracking-tight ${valueClass}`}
            >
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

      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">

        <ArrowUpRight className="h-3.5 w-3.5" />

        <span>{delta}</span>

      </div>

    </div>
  );
};

export default LogisticsFleetPage;