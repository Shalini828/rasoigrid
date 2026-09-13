import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CloudSun, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  Layers, 
  Cpu 
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import { ConfidenceScore } from '../../components/ui/ConfidenceScore';
import type { ForecastPrediction } from '../../core/types/models';
import { api } from '../../core/api/client';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

export const ForecastPage: React.FC = () => {
  const [predictions, setPredictions] = useState<ForecastPrediction[]>([]);

  useEffect(() => {
    api.getForecastPredictions().then(data => {
      setPredictions(data);
    });
  }, []);

  const hourlyForecastData = [
    { hour: '12:00', surplusKg: 120, predictedSurplus: 130, demandKg: 190 },
    { hour: '14:00', surplusKg: 290, predictedSurplus: 280, demandKg: 250 },
    { hour: '16:00', surplusKg: 95, predictedSurplus: 110, demandKg: 160 },
    { hour: '18:00', surplusKg: 180, predictedSurplus: 195, demandKg: 280 },
    { hour: '20:00', surplusKg: 420, predictedSurplus: 410, demandKg: 340 },
    { hour: '22:00', surplusKg: 580, predictedSurplus: 560, demandKg: 290 },
    { hour: '00:00', surplusKg: 220, predictedSurplus: 230, demandKg: 110 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              NEURAL-FORECAST V3.2
            </span>
            <h1 className="text-xl font-bold text-white font-mono">
              AI Surplus & Hunger Prediction Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Anticipatory surplus generation forecasts based on catering schedules, corporate calendar, and meteorological models.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Accuracy: <strong className="text-emerald-400">96.4%</strong></span>
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Predicted Next 24h Surplus"
          value="1,580"
          unit="kg"
          delta="+14% vs avg week"
          theme="indigo"
          icon={TrendingUp}
        />
        <MetricTile
          label="Pre-Positioned EV Fleets"
          value="12"
          unit="Vans"
          delta="Optimized staged nodes"
          theme="cyan"
          icon={MapPin}
        />
        <MetricTile
          label="Demand Deficit Zones"
          value="3"
          unit="Hotspots"
          delta="Kurla, Dharavi, Malad"
          theme="coral"
          icon={AlertCircle}
        />
        <MetricTile
          label="Weather Risk Index"
          value="Low (31°C)"
          delta="Normal thermal degradation"
          theme="emerald"
          icon={CloudSun}
        />
      </div>

      {/* Forecasting Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hour-by-Hour Prediction Area Chart */}
        <GlassCard glow="indigo" className="lg:col-span-8 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">
                Surplus Wave vs Community Demand Wave (24h Window)
              </h3>
              <p className="text-xs text-slate-400">
                AI Anticipated Surplus (Cyan) vs Real Demand Requirement (Indigo)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Predicted Surplus (kg)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Shelter Demand (kg)
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyForecastData}>
                <defs>
                  <linearGradient id="surplusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#475569" fontSize={12} fontFamily="monospace" />
                <YAxis stroke="#475569" fontSize={12} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="predictedSurplus" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#surplusGrad)" />
                <Area type="monotone" dataKey="demandKg" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#demandGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Prediction Intelligence Feed */}
        <GlassCard glow="cyan" className="lg:col-span-4 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-base">Model Signals</h3>
            </div>
            <p className="text-xs text-slate-400">
              Live external factors driving today's forecasting weights
            </p>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex justify-between font-mono text-cyan-300 font-semibold">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Wedding Season Peak</span>
                  <span>+28% Weight</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  54 Major banquet reservations registered in Dadar & Andheri corridor tonight.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex justify-between font-mono text-indigo-300 font-semibold">
                  <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Corporate Tech Shift</span>
                  <span>+15% Weight</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Quarter-end night catering in BKC financial hub.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex justify-between font-mono text-amber-300 font-semibold">
                  <span className="flex items-center gap-1"><CloudSun className="w-3.5 h-3.5" /> Micro-Climate</span>
                  <span>Safe</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Ambient humidity 64% — optimal for standard cold-chain transit.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-400 block text-center">
              Next model retraining cycle in 02:44:19
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Zone-by-Zone Forecast Matrix Cards */}
      <div className="space-y-3">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-slate-300">
          Regional Pre-Routing Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((pred) => (
            <GlassCard key={pred.id} glow="none" className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">{pred.zone}</span>
                </div>
                <ConfidenceScore score={pred.confidencePercent} size="sm" />
              </div>

              <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">TIME WINDOW</span>
                  <span className="text-slate-300 font-semibold">{pred.timeWindow}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PREDICTED KG</span>
                  <span className="text-cyan-400 font-bold">{pred.predictedSurplusKg} kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DEMAND RATIO</span>
                  <span className={`font-bold ${pred.demandMismatchRatio < 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {pred.demandMismatchRatio < 1 ? 'Deficit (High Need)' : 'Surplus Heavy'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-mono uppercase text-[11px] block text-indigo-200">Pre-Routing Action:</strong>
                  {pred.recommendedPreRouting}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
