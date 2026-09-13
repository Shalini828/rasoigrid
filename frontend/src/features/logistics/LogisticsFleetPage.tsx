import { 
  Truck, 
  BatteryCharging, 
  Thermometer, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Navigation 
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import { StatusPill } from '../../components/ui/StatusPill';
import { useRescueStore } from '../../stores/useRescueStore';

export const LogisticsFleetPage: React.FC = () => {
  const { missionsList, verifyMissionDelivery } = useRescueStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              COLD-CHAIN FLEET LOGISTICS
            </span>
            <h1 className="text-xl font-bold text-white font-mono">
              EV Fleet Dispatch & Route Optimizer
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, insulated cold-chain telemetry, and digital handover chain of custody.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <span>Fleet Battery Avg: <strong className="text-emerald-400">84%</strong></span>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Active Fleet Units"
          value="28"
          unit="EVs & Cargo Vans"
          delta="100% Zero-Emission Fleet"
          theme="cyan"
          icon={Truck}
        />
        <MetricTile
          label="Average Mission Time"
          value="24.5"
          unit="Mins"
          delta="18m faster than legacy logistics"
          theme="emerald"
          icon={Clock}
        />
        <MetricTile
          label="Cold-Chain Compliance"
          value="99.8"
          unit="%"
          delta="0 thermal breach incidents"
          theme="indigo"
          icon={Thermometer}
        />
        <MetricTile
          label="Missions Completed Today"
          value="42"
          unit="Rescues"
          delta="1,840 kg food saved"
          theme="amber"
          icon={CheckCircle2}
        />
      </div>

      {/* Active Missions Grid */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span>Active Mission Dispatch Board</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {missionsList.map((mission) => (
            <GlassCard
              key={mission.id}
              glow={mission.status === 'in_transit' ? 'emerald' : 'cyan'}
              className="p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700">
                    {mission.code}
                  </span>
                  <StatusPill status={mission.status} size="sm" />
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">
                    {mission.surplusItem?.foodName || 'Cooked Surplus Batch'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    From: <strong className="text-slate-200">{mission.surplusItem?.donorName}</strong>
                  </p>
                </div>

                {/* Routing Waypoints */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Pickup Origin</span>
                      <span className="text-slate-300">{mission.surplusItem?.location.address}</span>
                    </div>
                  </div>
                  <div className="w-px h-3 bg-slate-700 ml-1" />
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Delivery Hub</span>
                      <span className="text-indigo-300 font-semibold">{mission.receiverName}</span>
                    </div>
                  </div>
                </div>

                {/* Driver & Telemetry Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">DRIVER & VEHICLE</span>
                    <span className="text-slate-200 font-semibold truncate block">{mission.driverName}</span>
                    <span className="text-slate-400 text-[11px]">{mission.vehiclePlate}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">CHAMBER TEMP</span>
                    <span className="text-cyan-400 font-bold text-sm flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5" />
                      {mission.currentTempCelsius}°C
                    </span>
                    <span className="text-emerald-400 text-[10px]">Optimal Range</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Estimated ETA: <strong className="text-emerald-400">{mission.etaMinutes} mins</strong></span>
                  <a href={`tel:${mission.driverPhone}`} className="text-slate-300 hover:text-white flex items-center gap-1">
                    <Phone className="w-3 h-3 text-cyan-400" /> Call Driver
                  </a>
                </div>

                {mission.status === 'in_transit' && (
                  <button
                    onClick={() => verifyMissionDelivery(mission.id, mission.otpCode)}
                    className="w-full py-2 rounded-lg font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-mono shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFY RECEIVER OTP [{mission.otpCode}]</span>
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
