import React, { useState } from "react";

import {
  Truck,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Navigation,
  MapPin,
  PackageCheck,
  ArrowRight,
  CircleDot,
} from "lucide-react";

import { StatusPill } from "../../components/ui/StatusPill";
import { VolunteerProfileSetup } from "../../components/profile/ProfileSetup";
import { api } from "../../core/api/client";
import type { DispatchStatus } from "../../core/api/types";
import type { RescueMission } from "../../core/types/models";
import { useRescueStore } from "../../stores/useRescueStore";

/** Where a dispatch sits in the volunteer's workflow (index into the steps). */
const STEP_INDEX: Record<string, number> = {
  PENDING: 0,
  ASSIGNED: 0,
  PICKED_UP: 2,
  DELIVERED: 4,
  CANCELLED: -1,
};

const mapsLink = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

export const LogisticsFleetPage: React.FC = () => {
  const {
    missionsList,
    updateMissionStatus,
    volunteerProfile,
    setVolunteerProfile,
    hasLoaded,
    error,
  } = useRescueStore();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  const openMissions = missionsList.filter((m) =>
    ["ASSIGNED", "PICKED_UP"].includes(m.dispatchStatus),
  );
  const activeMission =
    missionsList.find((m) => m.dispatchStatus === "PICKED_UP") ??
    missionsList.find((m) => m.dispatchStatus === "ASSIGNED");
  const activeStep = activeMission ? STEP_INDEX[activeMission.dispatchStatus] ?? 0 : -1;

  // Handover codes typed by the volunteer, per mission.
  const [codes, setCodes] = useState<Record<string, string>>({});

  const advance = async (
    mission: RescueMission,
    status: DispatchStatus,
    code?: string,
  ) => {
    setUpdatingId(mission.id);
    setActionError("");
    try {
      await updateMissionStatus(mission.id, status, code);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update the pickup.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleAvailability = async () => {
    setTogglingAvailability(true);
    setActionError("");
    try {
      setVolunteerProfile(await api.toggleAvailability());
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not change availability.");
    } finally {
      setTogglingAvailability(false);
    }
  };

  const isAvailable = volunteerProfile?.availability_status === "AVAILABLE";

  return (
    <div className="min-h-full bg-[#f4f8f5] text-[#102a43]">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {hasLoaded && !volunteerProfile && <VolunteerProfileSetup />}

        {(error || actionError) && (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {actionError || error}
          </p>
        )}

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  <Truck className="h-3.5 w-3.5" />
                  Volunteer Mission Board
                </span>

                {volunteerProfile && (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isAvailable ? "text-emerald-600" : "text-slate-500"}`}>
                    <span className={`h-2 w-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-slate-400"}`} />
                    {isAvailable ? "You are available for pickups" : "You are not taking new pickups"}
                  </span>
                )}

              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#102a43] sm:text-3xl">
                Your Pickups
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                NGOs assign pickups to the nearest available volunteer.
                Collect the food from the donor, deliver it to the NGO,
                and mark each step here.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">

              {volunteerProfile && (
                <button
                  type="button"
                  onClick={toggleAvailability}
                  disabled={togglingAvailability || (!isAvailable && openMissions.length > 0)}
                  title={!isAvailable && openMissions.length > 0 ? "Finish your current pickup first" : undefined}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-50"
                >
                  {isAvailable ? "Go off duty" : "Go on duty"}
                </button>
              )}

              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Open Pickups
                  </p>

                  <div className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-[#102a43]">
                      {openMissions.length}
                    </span>

                    <span className="text-xs font-semibold text-emerald-600">
                      assigned to you
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* VOLUNTEER WORKFLOW */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:p-6">

          <div className="mb-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600">
              Your recovery workflow
            </p>

            <h2 className="mt-1 text-lg font-extrabold text-[#102a43]">
              {activeMission ? `Current pickup: ${activeMission.code}` : "No pickup in progress"}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <WorkflowStep number="01" label="Assigned" icon={<PackageCheck className="h-4 w-4" />} active={activeStep >= 0} />
            <WorkflowStep number="02" label="Go to donor" icon={<MapPin className="h-4 w-4" />} active={activeStep >= 0} />
            <WorkflowStep number="03" label="Picked up" icon={<Navigation className="h-4 w-4" />} active={activeStep >= 2} />
            <WorkflowStep number="04" label="Hand over" icon={<ShieldCheck className="h-4 w-4" />} active={activeStep >= 2} />
            <WorkflowStep number="05" label="Delivered" icon={<CheckCircle2 className="h-4 w-4" />} active={activeStep >= 4} />
          </div>
        </section>

        {/* MISSION BOARD */}
        <section>

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                  <Truck className="h-4 w-4 text-emerald-600" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                    Mission board
                  </p>

                  <h2 className="text-lg font-extrabold text-[#102a43]">
                    Assigned to You
                  </h2>
                </div>
              </div>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              <CircleDot className="h-3.5 w-3.5 text-emerald-500" />
              {missionsList.length} total
            </div>

          </div>

          {missionsList.length > 0 ? (

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

              {missionsList.map((mission) => {
                const pickup = mission.surplusItem?.location ?? null;
                const delivery = mission.receiverLocation;
                const isOpen = ["ASSIGNED", "PICKED_UP"].includes(mission.dispatchStatus);
                const busy = updatingId === mission.id;

                return (
                  <article
                    key={mission.id}
                    className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all ${
                      isOpen
                        ? "border-emerald-300 ring-2 ring-emerald-100"
                        : "border-slate-200"
                    }`}
                  >

                    {/* CARD HEADER */}
                    <div className="border-b border-slate-100 px-5 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] font-bold text-slate-700">
                            {mission.code}
                          </span>

                          <h3 className="mt-4 text-base font-extrabold leading-6 text-[#102a43]">
                            {mission.surplusItem?.foodName ?? "Food pickup"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Donor:{" "}
                            <span className="font-semibold text-slate-700">
                              {mission.surplusItem?.donorName ?? "Donor"}
                            </span>
                            {mission.surplusItem && ` · ${mission.surplusItem.quantityKg} kg`}
                          </p>
                        </div>

                        <StatusPill status={mission.status} size="sm" />
                      </div>
                    </div>

                    {/* ROUTE */}
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
                                Pickup
                              </p>
                              {pickup ? (
                                <a
                                  href={mapsLink(pickup.lat, pickup.lng)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-1 block truncate text-xs font-semibold text-emerald-700 underline"
                                >
                                  {pickup.address} (open map)
                                </a>
                              ) : (
                                <p className="mt-1 text-xs font-semibold text-slate-500">
                                  Donor gave no location. Ask the NGO.
                                </p>
                              )}
                            </div>

                            <div className="mt-5">
                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                Delivery
                              </p>
                              <p className="mt-1 text-xs font-bold text-indigo-700">
                                {mission.receiverName}
                              </p>
                              {mission.receiverAddress && (
                                <p className="mt-0.5 text-[11px] text-slate-500">
                                  {delivery ? (
                                    <a href={mapsLink(delivery.lat, delivery.lng)} target="_blank" rel="noreferrer" className="underline">
                                      {mission.receiverAddress}
                                    </a>
                                  ) : (
                                    mission.receiverAddress
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MISSION DETAILS */}
                    <div className="grid grid-cols-2 gap-3 px-5 pt-4">
                      <InfoCard
                        label="Consume before"
                        value={
                          mission.surplusItem
                            ? new Date(mission.surplusItem.safeUntil).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"
                        }
                        icon={<Clock className="h-3.5 w-3.5 text-emerald-600" />}
                      />
                      <InfoCard
                        label="Route"
                        value={mission.distanceKm !== null ? `${mission.distanceKm} km` : "Unknown"}
                        icon={<Navigation className="h-3.5 w-3.5 text-indigo-600" />}
                      />
                    </div>

                    {/* ACTION AREA */}
                    <div className="mt-auto px-5 pb-5 pt-4">
                      <div className="border-t border-slate-100 pt-4">

                        {mission.dispatchStatus === "ASSIGNED" && (
                          <button
                            type="button"
                            onClick={() => advance(mission, "PICKED_UP")}
                            disabled={busy}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-60"
                          >
                            <MapPin className="h-4 w-4" />
                            {busy ? "Saving…" : "I have picked up the food"}
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}

                        {mission.dispatchStatus === "PICKED_UP" && (
                          <div className="space-y-3">
                            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">
                              <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                                <p className="text-xs font-bold text-indigo-800">
                                  Hand over in person
                                </p>
                              </div>
                              <p className="mt-1 text-[10px] leading-5 text-indigo-700">
                                {mission.requiresHandoverCode
                                  ? "Give the food to an authorized person at the NGO and ask them for their 6-digit handover code."
                                  : "Give the food to an authorized person at the NGO, then confirm delivery."}
                              </p>
                            </div>

                            {mission.requiresHandoverCode && (
                              <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                NGO handover code
                                <input
                                  value={codes[mission.id] ?? ""}
                                  onChange={(e) =>
                                    setCodes((all) => ({
                                      ...all,
                                      [mission.id]: e.target.value.replace(/\D/g, "").slice(0, 6),
                                    }))
                                  }
                                  inputMode="numeric"
                                  autoComplete="one-time-code"
                                  placeholder="6 digits"
                                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center font-mono text-base tracking-[0.4em] text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                                />
                              </label>
                            )}

                            <button
                              type="button"
                              onClick={() => advance(mission, "DELIVERED", codes[mission.id])}
                              disabled={
                                busy ||
                                (mission.requiresHandoverCode &&
                                  (codes[mission.id] ?? "").length !== 6)
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-60"
                            >
                              <ShieldCheck className="h-4 w-4" />
                              {busy ? "Saving…" : "Delivered to the NGO"}
                            </button>
                          </div>
                        )}

                        {mission.dispatchStatus === "DELIVERED" && (
                          <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Delivered
                          </div>
                        )}

                        {mission.dispatchStatus === "CANCELLED" && (
                          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-500">
                            Cancelled by the NGO
                          </div>
                        )}


                      </div>
                    </div>

                  </article>
                );
              })}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <Truck className="h-7 w-7 text-emerald-600" />
              </div>

              <h3 className="mt-4 text-lg font-extrabold text-[#102a43]">
                No pickups assigned yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {isAvailable
                  ? "When an NGO claims food near you, the pickup will appear here."
                  : "Go on duty to receive pickups."}
              </p>

            </div>

          )}

        </section>

        {/* PRINCIPLES */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <PrincipleCard
            number="01"
            title="People First"
            description="Eligible food is prioritized for human consumption through authorized receiving organizations."
          />

          <PrincipleCard
            number="02"
            title="Recorded Handover"
            description="Each pickup and delivery you confirm is logged in the donation's audit trail."
          />

          <PrincipleCard
            number="03"
            title="Landfill Last"
            description="Food that cannot be consumed should move toward appropriate circular recovery pathways."
          />

        </section>

        {/* SAFETY NOTE */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-center text-xs text-emerald-800">
          <Phone className="h-3.5 w-3.5" />
          <span>
            <span className="font-bold">Volunteer safety protocol:</span>{" "}
            follow pickup instructions and the NGO's receiving procedures.
            RasoiGrid does not certify food as safe to eat.
          </span>
        </div>

      </div>
    </div>
  );
};

/* =========================================================
   WORKFLOW STEP
========================================================= */

interface WorkflowStepProps {
  number: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({
  number,
  label,
  icon,
  active,
}) => {
  return (
    <div
      className={`rounded-xl border p-3 ${
        active
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2">

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
            active
              ? "bg-white text-emerald-600"
              : "bg-white text-slate-400"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-[8px] font-mono font-bold text-slate-400">
            {number}
          </p>

          <p
            className={`text-[11px] font-bold ${
              active
                ? "text-emerald-700"
                : "text-slate-600"
            }`}
          >
            {label}
          </p>
        </div>

      </div>
    </div>
  );
};

/* =========================================================
   INFO CARD
========================================================= */

interface InfoCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">

      <div className="mb-2 flex items-center gap-1.5">
        {icon}

        <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-slate-400">
          {label}
        </span>
      </div>

      <p className="truncate text-xs font-bold text-[#102a43]">
        {value}
      </p>

    </div>
  );
};

/* =========================================================
   PRINCIPLE CARD
========================================================= */

interface PrincipleCardProps {
  number: string;
  title: string;
  description: string;
}

const PrincipleCard: React.FC<PrincipleCardProps> = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

      <div className="flex items-center gap-3">

        <span className="font-mono text-[10px] font-bold text-emerald-600">
          {number}
        </span>

        <h3 className="text-sm font-extrabold text-[#102a43]">
          {title}
        </h3>

      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
};

export default LogisticsFleetPage;