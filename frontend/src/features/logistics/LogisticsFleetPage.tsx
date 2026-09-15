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
import { useRescueStore } from "../../stores/useRescueStore";

type MissionStage =
  | "available"
  | "accepted"
  | "pickup"
  | "transit"
  | "handover"
  | "completed";

export const LogisticsFleetPage: React.FC = () => {
  const { missionsList, verifyMissionDelivery } = useRescueStore();

  const [acceptedMissionId, setAcceptedMissionId] = useState<
    number | string | null
  >(null);

  const [missionStages, setMissionStages] = useState<
    Record<string, MissionStage>
  >({});

  const [otpInputs, setOtpInputs] = useState<
    Record<string, string>
  >({});

  const getStage = (
    missionId: number | string
  ): MissionStage => {
    return (
      missionStages[String(missionId)] || "available"
    );
  };

  const updateStage = (
    missionId: number | string,
    stage: MissionStage
  ) => {
    setMissionStages((current) => ({
      ...current,
      [String(missionId)]: stage,
    }));
  };

  const handleAcceptMission = (
    missionId: number | string
  ) => {
    setAcceptedMissionId(missionId);
    updateStage(missionId, "accepted");
  };

  const handleVerifyHandover = (
    missionId: number | string
  ) => {
    const mission = missionsList.find(
      (item) => item.id === missionId
    );

    if (!mission) return;

    const enteredOtp =
      otpInputs[String(missionId)]?.trim();

    if (!enteredOtp) {
      alert("Please enter the receiver OTP.");
      return;
    }

    if (enteredOtp !== String(mission.otpCode)) {
      alert("Incorrect receiver OTP.");
      return;
    }

    verifyMissionDelivery(
      mission.id,
      enteredOtp
    );

    updateStage(mission.id, "completed");
  };

  const activeMission = missionsList.find(
    (mission) =>
      mission.id === acceptedMissionId
  );

  return (
    <div className="min-h-full bg-[#f4f8f5] text-[#102a43]">
      <div className="mx-auto max-w-[1500px] space-y-6">

        {/* HEADER */}
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.05)] lg:px-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">

                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  <Truck className="h-3.5 w-3.5" />
                  Volunteer Mission Board
                </span>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Recovery network active
                </span>

              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-[#102a43] sm:text-3xl">
                Recovery Missions
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Accept eligible food recovery missions, collect surplus
                from donors, deliver it to verified receiving organizations,
                and complete the digital handover.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Available Missions
                </p>

                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#102a43]">
                    {missionsList.length}
                  </span>

                  <span className="text-xs font-semibold text-emerald-600">
                    in network
                  </span>
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
              Mission execution
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">

            <WorkflowStep
              number="01"
              label="Accept"
              icon={<PackageCheck className="h-4 w-4" />}
              active
            />

            <WorkflowStep
              number="02"
              label="Pickup"
              icon={<MapPin className="h-4 w-4" />}
            />

            <WorkflowStep
              number="03"
              label="Transit"
              icon={<Navigation className="h-4 w-4" />}
            />

            <WorkflowStep
              number="04"
              label="Handover"
              icon={<ShieldCheck className="h-4 w-4" />}
            />

            <WorkflowStep
              number="05"
              label="Complete"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />

          </div>
        </section>

        {/* ACTIVE MISSION */}
        {activeMission && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:p-6">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Your active mission
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-extrabold text-[#102a43]">
                  {activeMission.surplusItem?.foodName ||
                    "Food Recovery Mission"}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  Mission {activeMission.code}
                </p>
              </div>

              <StatusPill
                status={activeMission.status}
                size="sm"
              />

            </div>

          </section>
        )}

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
                    Available Recovery Missions
                  </h2>
                </div>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Choose a mission you can complete and follow the recovery
                workflow from pickup to verified handover.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              <CircleDot className="h-3.5 w-3.5 text-emerald-500" />
              {missionsList.length} missions
            </div>

          </div>

          {missionsList.length > 0 ? (

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">

              {missionsList.map((mission) => {

                const stage = getStage(mission.id);

                const isMyMission =
                  acceptedMissionId === mission.id;

                return (
                  <article
                    key={mission.id}
                    className={`flex min-h-[470px] flex-col overflow-hidden rounded-2xl border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition-all ${
                      isMyMission
                        ? "border-emerald-300 ring-2 ring-emerald-100"
                        : "border-slate-200 hover:border-emerald-200"
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
                            {mission.surplusItem?.foodName ||
                              "Cooked Surplus Batch"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            Donor:{" "}
                            <span className="font-semibold text-slate-700">
                              {mission.surplusItem?.donorName ||
                                "Verified donor"}
                            </span>
                          </p>
                        </div>

                        <StatusPill
                          status={mission.status}
                          size="sm"
                        />

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

                              <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                                {mission.surplusItem?.location.address ||
                                  "Pickup location provided after acceptance"}
                              </p>
                            </div>

                            <div className="mt-5">

                              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                Delivery
                              </p>

                              <p className="mt-1 text-xs font-bold text-indigo-700">
                                {mission.receiverName ||
                                  "Verified receiving hub"}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* MISSION DETAILS */}
                    <div className="grid grid-cols-2 gap-3 px-5 pt-4">

                      <InfoCard
                        label="Estimated ETA"
                        value={`${mission.etaMinutes} mins`}
                        icon={
                          <Clock className="h-3.5 w-3.5 text-emerald-600" />
                        }
                      />

                      <InfoCard
                        label="Food Condition"
                        value="Human verified"
                        icon={
                          <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                        }
                      />

                    </div>

                    {/* ACTION AREA */}
                    <div className="mt-auto px-5 pb-5 pt-4">

                      <div className="border-t border-slate-100 pt-4">

                        {!isMyMission &&
                          stage !== "completed" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleAcceptMission(
                                  mission.id
                                )
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#102a43] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#173f5f] hover:shadow-md"
                            >
                              <Truck className="h-4 w-4 text-emerald-300" />
                              Accept Mission
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}

                        {isMyMission &&
                          stage === "accepted" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStage(
                                  mission.id,
                                  "pickup"
                                )
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
                            >
                              <MapPin className="h-4 w-4" />
                              Confirm Pickup
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}

                        {isMyMission &&
                          stage === "pickup" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateStage(
                                  mission.id,
                                  "transit"
                                )
                              }
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700"
                            >
                              <Navigation className="h-4 w-4" />
                              Start Transit
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}

                        {isMyMission &&
                          stage === "transit" && (
                            <div className="space-y-3">

                              <a
                                href={`tel:${mission.driverPhone}`}
                                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-600 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                              >
                                <Phone className="h-4 w-4" />
                                Contact Coordination
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStage(
                                    mission.id,
                                    "handover"
                                  )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700"
                              >
                                Arrived at Receiver
                                <ArrowRight className="h-4 w-4" />
                              </button>

                            </div>
                          )}

                        {isMyMission &&
                          stage === "handover" && (
                            <div className="space-y-3">

                              <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3">

                                <div className="flex items-center gap-2">

                                  <ShieldCheck className="h-4 w-4 text-indigo-600" />

                                  <p className="text-xs font-bold text-indigo-800">
                                    Receiver verification
                                  </p>

                                </div>

                                <p className="mt-1 text-[10px] leading-5 text-indigo-700">
                                  Ask the authorized receiver for the
                                  handover OTP. Do not use an OTP shown
                                  by the system.
                                </p>

                              </div>

                              <input
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter receiver OTP"
                                value={
                                  otpInputs[
                                    String(mission.id)
                                  ] || ""
                                }
                                onChange={(event) =>
                                  setOtpInputs(
                                    (current) => ({
                                      ...current,
                                      [String(
                                        mission.id
                                      )]:
                                        event.target.value,
                                    })
                                  )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#102a43] outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleVerifyHandover(
                                    mission.id
                                  )
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
                              >
                                <ShieldCheck className="h-4 w-4" />
                                Complete Handover
                              </button>

                            </div>
                          )}

                        {stage === "completed" && (
                          <div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Mission Completed
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
                No missions available
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                New eligible recovery missions will appear here when
                they are assigned to the volunteer network.
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
            title="Verified Handover"
            description="Digital handover records connect pickup, transit and receiver confirmation."
          />

          <PrincipleCard
            number="03"
            title="Landfill Last"
            description="Food that cannot be consumed should move toward appropriate circular recovery pathways."
          />

        </section>

        {/* SAFETY NOTE */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-center text-xs text-emerald-800">
          <span className="font-bold">
            Volunteer safety protocol:
          </span>{" "}
          follow authorized pickup instructions and receiving-organization
          procedures. RasoiGrid does not use AI to certify food as
          microbiologically safe.
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