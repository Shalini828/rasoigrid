import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  Clock, 
  Thermometer, 
  Radio, 
  Sparkles, 
  Building2
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusPill } from '../../components/ui/StatusPill';
import { LivePulse } from '../../components/ui/LivePulse';
import { ConfidenceScore } from '../../components/ui/ConfidenceScore';
import { useRescueStore } from '../../stores/useRescueStore';

// Custom Map Marker Icons
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="
        background-color: #0f172a;
        border: 2px solid ${color};
        color: ${color};
        padding: 4px 8px;
        border-radius: 9999px;
        font-family: monospace;
        font-size: 11px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 0 15px ${color}66;
        white-space: nowrap;
      ">
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${color};"></span>
        ${label}
      </div>
    `,
    iconSize: [80, 24],
    iconAnchor: [40, 12],
  });
};

export const DispatchCommandPage: React.FC = () => {
  const { surplusList, missionsList, dispatchMission, verifyMissionDelivery } = useRescueStore();
  const [selectedSurplusId, setSelectedSurplusId] = useState<string | null>(surplusList[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active_missions'>('pending');
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  const selectedSurplus = surplusList.find(s => s.id === selectedSurplusId);

  const handleDispatch = async (id: string) => {
    setDispatchingId(id);
    await dispatchMission(id, 'electric_van');
    setDispatchingId(null);
  };

  // Center coordinate around Mumbai Metro
  const mapCenter: [number, number] = [19.0760, 72.8777];

  return (
    <div className="space-y-4">
      {/* Header telemetry bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <LivePulse color="emerald" label="LIVE COMMAND MATRIX" />
            <h1 className="text-xl font-bold text-white font-mono">
              Urban Fleet Dispatch & Triage
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time cold-chain vehicle routing & surplus auto-matching engine
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Active EV Fleets: <strong className="text-emerald-400">28</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid Canvas: Map on Left (2/3), Dispatch Triage on Right (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[650px]">
        {/* Map View */}
        <div className="lg:col-span-8 rounded-xl overflow-hidden border border-slate-800 relative flex flex-col bg-slate-950">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', minHeight: '500px', width: '100%', background: '#070b0f' }}
          >
            {/* CartoDB Dark Matter free tile layer */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Donor / Surplus Markers */}
            {surplusList.map((item) => (
              <Marker
                key={item.id}
                position={[item.location.lat, item.location.lng]}
                icon={createCustomIcon(
                  item.priority === 'critical' ? '#f43f5e' : (item.status === 'in_transit' ? '#06b6d4' : '#10b981'),
                  `${item.quantityKg}kg`
                )}
                eventHandlers={{
                  click: () => setSelectedSurplusId(item.id),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 font-sans">
                    <div className="font-bold text-emerald-400 text-xs">{item.donorName}</div>
                    <div className="text-slate-300 text-xs">{item.foodName}</div>
                    <div className="text-slate-400 text-[11px] font-mono">
                      {item.quantityKg} kg • {item.portions} portions
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Destination / Shelter Markers */}
            {missionsList.map((mission) => (
              <React.Fragment key={mission.id}>
                <Marker
                  position={[mission.receiverLocation.lat, mission.receiverLocation.lng]}
                  icon={createCustomIcon('#6366f1', mission.receiverName.split(' ')[0])}
                >
                  <Popup>
                    <div className="p-1 text-xs">
                      <div className="font-bold text-indigo-400">{mission.receiverName}</div>
                      <div className="text-slate-300">{mission.receiverLocation.address}</div>
                    </div>
                  </Popup>
                </Marker>

                {/* Simulated Transit Polyline */}
                {mission.status === 'in_transit' && mission.surplusItem && (
                  <Polyline
                    positions={[
                      [mission.surplusItem.location.lat, mission.surplusItem.location.lng],
                      [mission.receiverLocation.lat, mission.receiverLocation.lng],
                    ]}
                    color="#10b981"
                    dashArray="6, 8"
                    weight={3}
                  />
                )}
              </React.Fragment>
            ))}
          </MapContainer>

          {/* Map Overlay Quick Legend */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-[11px] font-mono flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Kitchen Surplus
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Urgent (&lt;2h)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" /> Destination Shelter
            </span>
          </div>
        </div>

        {/* Triage & Active Operations Panel */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'pending'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Surplus Queue ({surplusList.filter(s => s.status === 'available').length})
            </button>
            <button
              onClick={() => setActiveTab('active_missions')}
              className={`py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'active_missions'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Missions ({missionsList.filter(m => m.status === 'in_transit' || m.status === 'dispatching').length})
            </button>
          </div>

          {/* Selected Item Detail / Action Card */}
          {activeTab === 'pending' && selectedSurplus && (
            <GlassCard glow="emerald" className="p-4 space-y-3 border-emerald-500/30">
              <div className="flex items-center justify-between">
                <StatusPill status={selectedSurplus.status} />
                {selectedSurplus.confidenceScore && (
                  <ConfidenceScore score={selectedSurplus.confidenceScore} size="sm" />
                )}
              </div>

              <div>
                <h3 className="font-bold text-white text-base leading-snug">
                  {selectedSurplus.foodName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {selectedSurplus.donorName} • {selectedSurplus.location.neighborhood}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">WEIGHT & PORTIONS</span>
                  <span className="text-emerald-400 font-bold">{selectedSurplus.quantityKg} kg / {selectedSurplus.portions} meals</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">TEMP STANDARD</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    {selectedSurplus.tempRequirement === 'hot_above_60c' ? '>60°C Hot Insulated' : '<4°C Chilled'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 text-[11px] font-mono">DIETARY & SAFETY ATTRIBUTES:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSurplus.dietaryTags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono capitalize">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {selectedSurplus.status === 'available' && (
                <button
                  onClick={() => handleDispatch(selectedSurplus.id)}
                  disabled={dispatchingId === selectedSurplus.id}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{dispatchingId === selectedSurplus.id ? 'CALCULATING OPTIMAL ROUTE...' : 'AI DISPATCH ELECTRIC VAN'}</span>
                </button>
              )}
            </GlassCard>
          )}

          {/* List of Surplus or Active Missions */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-[360px] pr-1">
            {activeTab === 'pending' ? (
              surplusList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedSurplusId(item.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedSurplusId === item.id
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-slate-400 font-semibold">{item.id}</span>
                    <StatusPill priority={item.priority} size="sm" />
                  </div>
                  <div className="font-medium text-white line-clamp-1">{item.foodName}</div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mt-2 font-mono">
                    <span>{item.quantityKg} kg</span>
                    <span>{item.location.neighborhood}</span>
                  </div>
                </div>
              ))
            ) : (
              missionsList.map((mission) => (
                <div
                  key={mission.id}
                  className="p-3 rounded-xl border bg-slate-900/70 border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-bold">{mission.code}</span>
                    <StatusPill status={mission.status} size="sm" />
                  </div>
                  <div className="text-white font-medium">
                    {mission.driverName} ({mission.vehiclePlate})
                  </div>
                  <div className="text-slate-400 text-[11px] flex items-center justify-between font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> ETA: {mission.etaMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-400" /> {mission.currentTempCelsius}°C
                    </span>
                  </div>

                  {mission.status === 'in_transit' && (
                    <button
                      onClick={() => verifyMissionDelivery(mission.id, mission.otpCode)}
                      className="w-full py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-mono font-semibold transition-all"
                    >
                      VERIFY RECEIVER HANDOVER (OTP {mission.otpCode})
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
