import React, { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Leaf,
  MapPin,
  PackageCheck,
  Radio,
  Recycle,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Truck,
  Utensils,
  Users,
} from "lucide-react";

import { StatusPill } from "../../components/ui/StatusPill";
import { ConfidenceScore } from "../../components/ui/ConfidenceScore";
import { useRescueStore } from "../../stores/useRescueStore";

type MapPoint = {
  lat: number;
  lng: number;
  label: string;
};

const MUMBAI_CENTER: [number, number] = [19.076, 72.8777];

/*
 * Demo neighbourhood coordinates for the operational map.
 * If your backend later provides exact coordinates, those can replace these.
 */
const NEIGHBORHOOD_COORDS: Record<string, MapPoint> = {
  "Bandra West": {
    lat: 19.0607,
    lng: 72.8362,
    label: "Bandra West",
  },
  "Bandra-Kurla Complex": {
    lat: 19.0728,
    lng: 72.8826,
    label: "Bandra-Kurla Complex",
  },
  "Goregaon East": {
    lat: 19.1663,
    lng: 72.8566,
    label: "Goregaon East",
  },
  Powai: {
    lat: 19.1176,
    lng: 72.906,
    label: "Powai",
  },
  "Andheri West": {
    lat: 19.1364,
    lng: 72.8277,
    label: "Andheri West",
  },
  Dharavi: {
    lat: 19.0418,
    lng: 72.8536,
    label: "Dharavi",
  },
  "Lower Parel": {
    lat: 18.9988,
    lng: 72.8258,
    label: "Lower Parel",
  },
  Colaba: {
    lat: 18.9067,
    lng: 72.8147,
    label: "Colaba",
  },
  Worli: {
    lat: 19.0178,
    lng: 72.8173,
    label: "Worli",
  },
  Kurla: {
    lat: 19.0726,
    lng: 72.8797,
    label: "Kurla",
  },
};

const FALLBACK_POINTS: MapPoint[] = [
  {
    lat: 19.0607,
    lng: 72.8362,
    label: "Bandra West",
  },
  {
    lat: 19.0728,
    lng: 72.8826,
    label: "Bandra-Kurla Complex",
  },
  {
    lat: 19.1663,
    lng: 72.8566,
    label: "Goregaon East",
  },
  {
    lat: 19.1176,
    lng: 72.906,
    label: "Powai",
  },
  {
    lat: 19.1364,
    lng: 72.8277,
    label: "Andheri West",
  },
];

/* -------------------------------------------------- */
/* MAP HELPERS */
/* -------------------------------------------------- */

const getMapPoint = (neighborhood: string, index: number): MapPoint => {
  return (
    NEIGHBORHOOD_COORDS[neighborhood] ||
    FALLBACK_POINTS[index % FALLBACK_POINTS.length]
  );
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "critical":
      return "#f43f5e";

    case "high":
      return "#f59e0b";

    case "medium":
      return "#3b82f6";

    default:
      return "#10b981";
  }
};

const MapRecenter: React.FC<{
  position: [number, number];
}> = ({ position }) => {
  const map = useMap();

  React.useEffect(() => {
    map.flyTo(position, 11, {
      duration: 0.8,
    });
  }, [map, position]);

  return null;
};

/* -------------------------------------------------- */
/* MAIN PAGE */
/* -------------------------------------------------- */

export const DispatchCommandPage: React.FC = () => {
  const { surplusList, missionsList, dispatchMission, verifyMissionDelivery } =
    useRescueStore();

  const [selectedSurplusId, setSelectedSurplusId] = useState<string | null>(
    surplusList[0]?.id || null,
  );

  const [activeTab, setActiveTab] = useState<"surplus" | "missions">("surplus");

  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedSurplusId && surplusList.length > 0) {
      setSelectedSurplusId(surplusList[0].id);
    }
  }, [surplusList, selectedSurplusId]);

  const selectedSurplus = surplusList.find(
    (item) => item.id === selectedSurplusId,
  );

  const availableSurplus = surplusList.filter(
    (item) => item.status === "available",
  );

  const activeMissions = missionsList.filter(
    (mission) =>
      mission.status === "in_transit" || mission.status === "dispatching",
  );

  const urgentSurplus = surplusList.filter(
    (item) => item.priority === "critical" || item.priority === "high",
  );

  const totalKg = surplusList.reduce((sum, item) => sum + item.quantityKg, 0);

  const selectedMapPosition = useMemo<[number, number]>(() => {
    if (!selectedSurplus) {
      return MUMBAI_CENTER;
    }

    const point = getMapPoint(
      selectedSurplus.location.neighborhood,
      Math.max(
        0,
        surplusList.findIndex((item) => item.id === selectedSurplus.id),
      ),
    );

    return [point.lat, point.lng];
  }, [selectedSurplus, surplusList]);

  const handleDispatch = async (id: string) => {
    setDispatchingId(id);

    try {
      await dispatchMission(id, "electric_van");
    } finally {
      setDispatchingId(null);
    }
  };

  return (
    <div className="min-h-full bg-[#f6f8f4] text-[#102a43]">
      {/* -------------------------------------------------- */}
      {/* PAGE HEADER */}
      {/* -------------------------------------------------- */}

      <div className="border-b border-[#dce7df] bg-white">
        <div className="px-5 py-5 lg:px-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  <Radio className="h-3.5 w-3.5" />
                  Food Recovery Command
                </span>

                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Coordination active
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#102a43]">
                Urban Food Surplus Command Center
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Make surplus visible, prioritize the right recovery pathway, and
                coordinate eligible food toward verified community receivers
                before it becomes waste.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Surplus
                </div>

                <div className="mt-1 text-xl font-bold text-[#102a43]">
                  {surplusList.length}
                </div>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">
                  Urgent
                </div>

                <div className="mt-1 text-xl font-bold text-rose-700">
                  {urgentSurplus.length}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  Active missions
                </div>

                <div className="mt-1 text-xl font-bold text-emerald-700">
                  {activeMissions.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* PAGE CONTENT */}
      {/* -------------------------------------------------- */}

      <div className="px-5 py-5 lg:px-7">
        {/* -------------------------------------------------- */}
        {/* CORE AGENDA */}
        {/* -------------------------------------------------- */}

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Predict */}

          <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Sparkles className="h-5 w-5" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                01
              </span>
            </div>

            <h2 className="text-base font-bold text-[#102a43]">Predict</h2>

            <p className="mt-1 text-sm leading-5 text-slate-600">
              Identify surplus risk and urgency so the system can prioritize the
              right response.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-indigo-600">
              <span>Surplus intelligence</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Route */}

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Truck className="h-5 w-5" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                02
              </span>
            </div>

            <h2 className="text-base font-bold text-[#102a43]">Route</h2>

            <p className="mt-1 text-sm leading-5 text-slate-600">
              Connect eligible surplus with verified receivers and coordinate
              the required pickup pathway.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span>Verified coordination</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Recover */}

          <div className="rounded-2xl border border-lime-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50 text-lime-700">
                <Recycle className="h-5 w-5" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-lime-600">
                03
              </span>
            </div>

            <h2 className="text-base font-bold text-[#102a43]">Recover</h2>

            <p className="mt-1 text-sm leading-5 text-slate-600">
              When human redistribution is not possible, direct appropriate
              organic material toward circular recovery.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-lime-700">
              <span>Circular recovery</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* PRINCIPLE BAR */}
        {/* -------------------------------------------------- */}

        <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-700 px-5 py-4 text-white shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <HeartHandshake className="h-6 w-6 text-emerald-100" />

              <div>
                <div className="text-sm font-bold">People First</div>

                <div className="text-xs text-emerald-100">
                  Eligible food is prioritized for human redistribution.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/15 px-3 py-1.5">
                1. People First
              </span>

              <ArrowRight className="h-3.5 w-3.5 text-emerald-200" />

              <span className="rounded-full bg-white/15 px-3 py-1.5">
                2. Circular Recovery
              </span>

              <ArrowRight className="h-3.5 w-3.5 text-emerald-200" />

              <span className="rounded-full bg-white/15 px-3 py-1.5">
                3. Landfill Last
              </span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* LIVE OPERATIONS MAP */}
        {/* -------------------------------------------------- */}

        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                      Live Operations Map
                    </div>

                    <h2 className="text-lg font-bold text-[#102a43]">
                      Urban recovery network
                    </h2>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Surplus locations, recovery demand and active coordination
                  across the urban food loop.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Surplus
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-700">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Critical
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold text-indigo-700">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  Receiver
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12">
            {/* MAP */}

            <div className="relative h-[430px] xl:col-span-8">
              <MapContainer
                center={MUMBAI_CENTER}
                zoom={11}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapRecenter position={selectedMapPosition} />

                {/* SURPLUS MARKERS */}

                {surplusList.map((item, index) => {
                  const point = getMapPoint(item.location.neighborhood, index);

                  const isSelected = selectedSurplusId === item.id;

                  const priorityColor = getPriorityColor(item.priority);

                  return (
                    <React.Fragment key={item.id}>
                      <CircleMarker
                        center={[point.lat, point.lng]}
                        radius={isSelected ? 12 : 9}
                        pathOptions={{
                          color: priorityColor,
                          fillColor: priorityColor,
                          fillOpacity: isSelected ? 0.95 : 0.75,
                          weight: isSelected ? 4 : 2,
                        }}
                        eventHandlers={{
                          click: () => setSelectedSurplusId(item.id),
                        }}
                      >
                        <Popup>
                          <div className="min-w-[210px]">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {item.id}
                            </div>

                            <div className="mt-1 text-sm font-bold text-slate-900">
                              {item.foodName}
                            </div>

                            <div className="mt-2 text-xs text-slate-600">
                              {item.quantityKg} kg
                            </div>

                            <div className="mt-1 text-xs text-slate-500">
                              {item.location.neighborhood}
                            </div>

                            <div className="mt-2 text-xs font-semibold capitalize">
                              Priority: {item.priority}
                            </div>

                            <button
                              onClick={() => setSelectedSurplusId(item.id)}
                              className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                            >
                              Open surplus
                            </button>
                          </div>
                        </Popup>
                      </CircleMarker>
                    </React.Fragment>
                  );
                })}

                {/* RECEIVER NETWORK NODES */}

                <CircleMarker
                  center={[19.0473, 72.857]}
                  radius={9}
                  pathOptions={{
                    color: "#6366f1",
                    fillColor: "#6366f1",
                    fillOpacity: 0.85,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="min-w-[190px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                        VERIFIED RECEIVER
                      </div>

                      <div className="mt-1 text-sm font-bold">
                        Community Shelter
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        Receiving capacity available
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>

                <CircleMarker
                  center={[19.1176, 72.906]}
                  radius={9}
                  pathOptions={{
                    color: "#6366f1",
                    fillColor: "#6366f1",
                    fillOpacity: 0.85,
                    weight: 3,
                  }}
                >
                  <Popup>
                    <div className="min-w-[190px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                        VERIFIED RECEIVER
                      </div>

                      <div className="mt-1 text-sm font-bold">
                        Powai Community Hub
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        Receiving capacity available
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>

                {/* SELECTED ROUTE */}

                {selectedSurplus && (
                  <Polyline
                    positions={[selectedMapPosition, [19.0473, 72.857]]}
                    pathOptions={{
                      color: "#10b981",
                      weight: 4,
                      opacity: 0.8,
                      dashArray: "8 8",
                    }}
                  />
                )}
              </MapContainer>

              {/* MAP OVERLAY */}

              <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Recovery network
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Available surplus
                  </span>

                  <span className="flex items-center gap-1.5 text-rose-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    Urgent
                  </span>

                  <span className="flex items-center gap-1.5 text-indigo-600">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    Receiver
                  </span>
                </div>
              </div>
            </div>

            {/* MAP SIDE PANEL */}

            <div className="border-t border-slate-100 bg-[#fbfcfa] p-4 xl:col-span-4 xl:border-l xl:border-t-0">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Live network
                  </div>

                  <h3 className="mt-1 text-base font-bold text-[#102a43]">
                    Recovery activity
                  </h3>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Radio className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-2">
                {surplusList.slice(0, 4).map((item, index) => {
                  const point = getMapPoint(item.location.neighborhood, index);

                  const isSelected = selectedSurplusId === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSurplusId(item.id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          {item.id}
                        </span>

                        <StatusPill priority={item.priority} size="sm" />
                      </div>

                      <div className="mt-2 line-clamp-1 text-sm font-bold text-[#102a43]">
                        {item.foodName}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{item.quantityKg} kg</span>

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {point.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                <div className="flex items-start gap-2">
                  <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                  <div>
                    <div className="text-xs font-bold text-emerald-800">
                      People-first routing
                    </div>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-700">
                      Eligible surplus is prioritized toward verified community
                      receivers before circular fallback pathways.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* MAIN WORKSPACE */}
        {/* -------------------------------------------------- */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          {/* LEFT */}

          <div className="xl:col-span-8">
            {selectedSurplus && (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* SELECTED SURPLUS HEADER */}

                <div className="border-b border-slate-100 px-5 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-600">
                          {selectedSurplus.id}
                        </span>

                        <StatusPill status={selectedSurplus.status} size="sm" />

                        <StatusPill
                          priority={selectedSurplus.priority}
                          size="sm"
                        />
                      </div>

                      <h2 className="text-2xl font-bold tracking-tight text-[#102a43]">
                        {selectedSurplus.foodName}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Utensils className="h-4 w-4 text-emerald-600" />
                          {selectedSurplus.donorName}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {selectedSurplus.location.neighborhood}
                        </span>
                      </div>
                    </div>

                    {selectedSurplus.confidenceScore && (
                      <ConfidenceScore
                        score={selectedSurplus.confidenceScore}
                        size="sm"
                      />
                    )}
                  </div>
                </div>

                {/* CORE DETAILS */}

                <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-5 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Available surplus
                    </div>

                    <div className="mt-2 text-2xl font-bold text-[#102a43]">
                      {selectedSurplus.quantityKg}

                      <span className="ml-1 text-sm font-medium text-slate-500">
                        kg
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {selectedSurplus.portions} estimated meals
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Handling condition
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[#102a43]">
                      <Thermometer className="h-4 w-4 text-amber-500" />

                      {selectedSurplus.tempRequirement === "hot_above_60c"
                        ? ">60°C Hot / Insulated"
                        : "<4°C Chilled"}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      Supports operational coordination
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Recovery priority
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
                      <HeartHandshake className="h-4 w-4" />
                      People First
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      Verify before human handover
                    </div>
                  </div>
                </div>

                {/* PREDICT */}

                <div className="border-b border-slate-100 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">
                        01 · Predict
                      </div>

                      <h3 className="text-base font-bold text-[#102a43]">
                        AI prioritization
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                        Surplus risk
                      </div>

                      <div className="mt-1 text-lg font-bold text-indigo-800">
                        {selectedSurplus.priority === "critical" ||
                        selectedSurplus.priority === "high"
                          ? "HIGH"
                          : "MEDIUM"}
                      </div>
                    </div>

                    <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-500">
                        Response priority
                      </div>

                      <div className="mt-1 text-lg font-bold capitalize text-rose-700">
                        {selectedSurplus.priority}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Recommended action
                      </div>

                      <div className="mt-1 text-sm font-bold text-[#102a43]">
                        Coordinate recovery
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                    <p className="text-xs leading-5 text-slate-600">
                      AI supports forecasting, prioritization and operational
                      recommendations. It does not independently certify food
                      safety. Final food-safety decisions remain with authorized
                      personnel and receiving organizations.
                    </p>
                  </div>
                </div>

                {/* ROUTE */}

                <div className="border-b border-slate-100 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Truck className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                        02 · Route
                      </div>

                      <h3 className="text-base font-bold text-[#102a43]">
                        People-first recovery pathway
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <HeartHandshake className="h-5 w-5 text-emerald-600" />

                      <div className="mt-3 text-sm font-bold text-[#102a43]">
                        Verified receiver
                      </div>

                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        Eligible surplus can be coordinated with verified
                        community organizations.
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <Users className="h-5 w-5 text-slate-600" />

                      <div className="mt-3 text-sm font-bold text-[#102a43]">
                        Pickup coordination
                      </div>

                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        Match available transport or volunteer capacity to the
                        recovery request.
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />

                      <div className="mt-3 text-sm font-bold text-[#102a43]">
                        Human-verified handover
                      </div>

                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        Physical inspection and final handover remain human
                        responsibilities.
                      </div>
                    </div>
                  </div>

                  {selectedSurplus.status === "available" && (
                    <button
                      onClick={() => handleDispatch(selectedSurplus.id)}
                      disabled={dispatchingId === selectedSurplus.id}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Truck className="h-4 w-4" />

                      {dispatchingId === selectedSurplus.id
                        ? "Preparing recovery coordination..."
                        : "Coordinate People-First Recovery"}

                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* RECOVER */}

                <div className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-50 text-lime-700">
                      <Recycle className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-lime-700">
                        03 · Recover
                      </div>

                      <h3 className="text-base font-bold text-[#102a43]">
                        Circular recovery fallback
                      </h3>
                    </div>
                  </div>

                  <div className="rounded-xl border border-lime-200 bg-lime-50/60 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-3">
                        <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-lime-700" />

                        <div>
                          <div className="text-sm font-bold text-[#102a43]">
                            Recovery when human redistribution is not possible
                          </div>

                          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
                            Appropriate organic material can move toward
                            circular pathways such as composting or biorecovery,
                            subject to applicable requirements.
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-lime-700 shadow-sm">
                        LANDFILL LAST
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* -------------------------------------------------- */}
          {/* RIGHT SIDE */}
          {/* -------------------------------------------------- */}

          <div className="space-y-5 xl:col-span-4">
            {/* RECOVERY QUEUE */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Operations
                    </div>

                    <h2 className="mt-1 text-lg font-bold text-[#102a43]">
                      Recovery Queue
                    </h2>
                  </div>

                  <PackageCheck className="h-5 w-5 text-emerald-600" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    onClick={() => setActiveTab("surplus")}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      activeTab === "surplus"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Surplus ({availableSurplus.length})
                  </button>

                  <button
                    onClick={() => setActiveTab("missions")}
                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                      activeTab === "missions"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Missions ({activeMissions.length})
                  </button>
                </div>
              </div>

              <div className="max-h-[560px] space-y-2 overflow-y-auto p-3">
                {activeTab === "surplus"
                  ? surplusList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedSurplusId(item.id)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selectedSurplusId === item.id
                            ? "border-emerald-300 bg-emerald-50/70 shadow-sm"
                            : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            {item.id}
                          </span>

                          <StatusPill priority={item.priority} size="sm" />
                        </div>

                        <div className="mt-2 line-clamp-2 text-sm font-bold text-[#102a43]">
                          {item.foodName}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold">
                            {item.quantityKg} kg
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.location.neighborhood}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                          <HeartHandshake className="h-3.5 w-3.5" />
                          People-first pathway
                        </div>
                      </button>
                    ))
                  : missionsList.map((mission) => (
                      <div
                        key={mission.id}
                        className="rounded-xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-bold text-emerald-700">
                            {mission.code}
                          </span>

                          <StatusPill status={mission.status} size="sm" />
                        </div>

                        <div className="mt-3 text-sm font-bold text-[#102a43]">
                          {mission.driverName}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {mission.vehiclePlate}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-slate-50 p-2.5">
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500">
                              <Clock className="h-3 w-3" />
                              ETA
                            </div>

                            <div className="mt-1 text-sm font-bold text-[#102a43]">
                              {mission.etaMinutes} min
                            </div>
                          </div>

                          <div className="rounded-lg bg-slate-50 p-2.5">
                            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-slate-500">
                              <Thermometer className="h-3 w-3" />
                              Temp
                            </div>

                            <div className="mt-1 text-sm font-bold text-[#102a43]">
                              {mission.currentTempCelsius}°C
                            </div>
                          </div>
                        </div>

                        {mission.status === "in_transit" && (
                          <button
                            onClick={() =>
                              verifyMissionDelivery(mission.id, mission.otpCode)
                            }
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-[11px] font-bold text-indigo-700 transition hover:bg-indigo-100"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verify receiver handover
                          </button>
                        )}
                      </div>
                    ))}

                {activeTab === "surplus" && surplusList.length === 0 && (
                  <div className="px-4 py-10 text-center">
                    <PackageCheck className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No active surplus entries
                    </p>
                  </div>
                )}

                {activeTab === "missions" && missionsList.length === 0 && (
                  <div className="px-4 py-10 text-center">
                    <Truck className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No active recovery missions
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RECOVERY RULE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                    Recovery rule
                  </div>

                  <h3 className="text-base font-bold text-[#102a43]">
                    People first. Always.
                  </h3>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <HeartHandshake className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#102a43]">
                      Human redistribution
                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                      Eligible surplus moves toward verified community
                      receivers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-lime-100 text-lime-700">
                    <Recycle className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#102a43]">
                      Circular recovery
                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                      Unavoidable organic material can move toward appropriate
                      recovery pathways.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#102a43]">
                      Landfill last
                    </div>

                    <p className="text-xs leading-5 text-slate-500">
                      Disposal is treated as the final fallback, not the default
                      destination.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CURRENT NETWORK */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Current network
                  </div>

                  <h3 className="mt-1 text-base font-bold text-[#102a43]">
                    Coordination overview
                  </h3>
                </div>

                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    Surplus volume
                  </div>

                  <div className="mt-1 text-lg font-bold text-[#102a43]">
                    {totalKg}

                    <span className="ml-1 text-xs font-medium text-slate-500">
                      kg
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">
                    Active recovery
                  </div>

                  <div className="mt-1 text-lg font-bold text-emerald-700">
                    {activeMissions.length}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                <p className="text-[11px] leading-5 text-amber-800">
                  Operational recommendations support coordination only. Final
                  food-safety decisions remain with authorized human personnel
                  and receiving organizations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* BOTTOM HIERARCHY */}
        {/* -------------------------------------------------- */}

        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#102a43]">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            RasoiGrid recovery hierarchy
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="text-emerald-700">People First</span>

            <ArrowRight className="h-3.5 w-3.5" />

            <span className="text-lime-700">Circular Recovery</span>

            <ArrowRight className="h-3.5 w-3.5" />

            <span>Landfill Last</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchCommandPage;
