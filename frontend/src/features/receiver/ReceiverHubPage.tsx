import React, { useEffect, useState } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  Users, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import type { ReceiverHub } from '../../core/types/models';
import { api } from '../../core/api/client';

export const ReceiverHubPage: React.FC = () => {
  const [hubs, setHubs] = useState<ReceiverHub[]>([]);
  const [filter, setFilter] = useState<'all' | 'urgent_shortage' | 'normal'>('all');

  useEffect(() => {
    api.getReceiverHubs().then(setHubs);
  }, []);

  const filteredHubs = hubs.filter(h => filter === 'all' || h.urgencyLevel === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              PEOPLE FIRST DISTRIBUTION
            </span>
            <h1 className="text-xl font-bold text-white font-mono">
              Shelter & Food Bank Intake Terminal
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Matching nutritious surplus meals to verified urban shelters, orphanages, and community kitchens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span>Verified Beneficiaries: <strong className="text-emerald-400">65,400+</strong></span>
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Registered Partner Hubs"
          value="48"
          unit="Shelters"
          delta="Mumbai Metro Area"
          theme="emerald"
          icon={Users}
        />
        <MetricTile
          label="Daily Meal Capacity"
          value="3,050"
          unit="Meals / day"
          delta="84% utilization"
          theme="cyan"
          icon={HeartHandshake}
        />
        <MetricTile
          label="Urgent Deficit Hotspots"
          value="2"
          unit="Hubs"
          delta="Shortage in Kurla & Dharavi"
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            filter === 'all'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          All Distribution Hubs ({hubs.length})
        </button>
        <button
          onClick={() => setFilter('urgent_shortage')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
            filter === 'urgent_shortage'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          Urgent Shortage ({hubs.filter(h => h.urgencyLevel === 'urgent_shortage').length})
        </button>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHubs.map((hub) => {
          const capacityPercent = Math.round((hub.currentIntakeMeals / hub.dailyCapacityMeals) * 100);

          return (
            <GlassCard
              key={hub.id}
              glow={hub.urgencyLevel === 'urgent_shortage' ? 'coral' : 'emerald'}
              className="p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                    hub.urgencyLevel === 'urgent_shortage'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {hub.urgencyLevel === 'urgent_shortage' ? '⚠️ URGENT FOOD SHORTAGE' : 'ACTIVE INTAKE NORMAL'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{hub.id}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{hub.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {hub.location.address} ({hub.location.neighborhood})
                  </p>
                </div>

                {/* Capacity Gauge */}
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Intake Fill Rate:</span>
                    <span className="text-white font-bold">{hub.currentIntakeMeals} / {hub.dailyCapacityMeals} meals ({capacityPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        capacityPercent >= 90 ? 'bg-amber-400' : (capacityPercent < 60 ? 'bg-rose-400' : 'bg-emerald-400')
                      }`}
                      style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Accepted Dietary tags */}
                <div className="space-y-1 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">ACCEPTED DIETARY PROTOCOLS:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {hub.acceptedDietary.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px] capitalize">
                        {d.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="text-slate-400">
                  <span className="block text-[10px]">COORDINATOR</span>
                  <span className="text-slate-200 font-semibold">{hub.contactPerson}</span>
                </div>
                <a
                  href={`tel:${hub.contactPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Hub</span>
                </a>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
