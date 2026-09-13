import React, { useEffect, useState } from 'react';
import { 
  Recycle, 
  Flame, 
  Zap, 
  Leaf, 
  MapPin, 
  Factory 
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-semibold flex items-center gap-1">
              <Recycle className="w-3.5 h-3.5 text-amber-400" />
              CIRCULAR BIO-DIVERSION
            </span>
            <h1 className="text-xl font-bold text-white font-mono">
              Non-Edible Organic Loop & Biomethanation
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero-landfill protocol diverting food prep waste, peels, and spoiled batches to BSFL protein & municipal clean biogas plants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            <span>Landfill Diversion Rate: <strong className="text-emerald-400">99.4%</strong></span>
          </div>
        </div>
      </div>

      {/* Top Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* 3 Circular Streams Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard glow="cyan" className="p-5 space-y-3 border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-400">
            <Flame className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Anaerobic Biogas Cogeneration</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            High-volume kitchen prep trimmings and high-moisture fruit waste are fed into sealed anaerobic digesters. Methane is scrubbed and combusted for zero-emission electricity.
          </p>
          <div className="text-[11px] font-mono text-cyan-300 pt-2 border-t border-slate-800">
            Output: Clean Grid Electricity + Bio-fertilizer Slurry
          </div>
        </GlassCard>

        <GlassCard glow="amber" className="p-5 space-y-3 border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400">
            <Leaf className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Black Soldier Fly Larvae (BSFL)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Voracious Hermetia illucens larvae consume dense bakery and grain residues within 72 hours, converting organic mass into premium high-protein animal feed and organic frass fertilizer.
          </p>
          <div className="text-[11px] font-mono text-amber-300 pt-2 border-t border-slate-800">
            Output: 40% Crude Protein Meal + Zero Waste
          </div>
        </GlassCard>

        <GlassCard glow="emerald" className="p-5 space-y-3 border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400">
            <Recycle className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">Micro-Community Aerobic Digesters</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Decentralized neighborhood composters installed at urban parks and corporate campuses convert vegetable trimmings into rich compost for city gardens.
          </p>
          <div className="text-[11px] font-mono text-emerald-300 pt-2 border-t border-slate-800">
            Output: Organic Soil Enricher (Humus)
          </div>
        </GlassCard>
      </div>

      {/* Facilities Live Monitor */}
      <div className="space-y-4">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Factory className="w-4 h-4 text-amber-400" />
          <span>Connected Circular Processing Units</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilities.map((facility) => {
            const utilization = Math.round((facility.currentTonnageKg / facility.dailyCapacityKg) * 100);

            return (
              <GlassCard key={facility.id} glow="none" className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {facility.type.toUpperCase().replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {facility.methaneConversionEfficiency}% Efficiency
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{facility.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {facility.location.neighborhood}, {facility.location.city}
                  </p>
                </div>

                {/* Utilization gauge */}
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Current Intake:</span>
                    <span className="text-white font-bold">{facility.currentTonnageKg} / {facility.dailyCapacityKg} kg ({utilization}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Clean Energy Output:</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {facility.energyGeneratedKwh.toLocaleString()} kWh
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
