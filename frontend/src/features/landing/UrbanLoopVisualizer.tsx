import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Sparkles, 
  Heart, 
  Recycle, 
  Thermometer, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Clock
} from 'lucide-react';

interface FlowScenario {
  id: string;
  source: string;
  sourceType: string;
  quantity: string;
  item: string;
  aiClassification: string;
  destinationHuman: string;
  destinationCircular: string;
  humanShare: string;
  circularShare: string;
  tempRequirement: string;
  decayMinutes: number;
}

const SCENARIOS: FlowScenario[] = [
  {
    id: 'banquet',
    source: 'Grand Regency Hotel',
    sourceType: 'Luxury Banquet Buffet',
    quantity: '75 kg (190 Portions)',
    item: 'Hot Shahi Paneer, Dal & Rice',
    aiClassification: 'High-Value Edible Cooked Surplus',
    destinationHuman: 'Kurla Community Food Bank',
    destinationCircular: 'Kitchen prep scraps to Bio-Digester',
    humanShare: '94%',
    circularShare: '6%',
    tempRequirement: 'Thermal Pod (>60°C Hot)',
    decayMinutes: 215,
  },
  {
    id: 'tech_campus',
    source: 'Apex Tech Park Canteen',
    sourceType: 'Corporate Food Service',
    quantity: '48 kg (120 Portions)',
    item: 'Fresh Salads & Dairy Meals',
    aiClassification: 'Chilled Cold-Chain Surplus',
    destinationHuman: 'Asha Deep Children Shelter',
    destinationCircular: 'Fruit peelings to Composting Unit',
    humanShare: '90%',
    circularShare: '10%',
    tempRequirement: 'Refrigerated (<4°C Chilled)',
    decayMinutes: 240,
  },
  {
    id: 'mandi_wholesale',
    source: 'Central Wholesale Mandi',
    sourceType: 'Agricultural Aggregator',
    quantity: '220 kg Organic Mass',
    item: 'Over-Ripe Fruit & Vegetable Prep',
    aiClassification: 'Non-Edible Organic Biomass',
    destinationHuman: 'Unsuitable for Human Intake',
    destinationCircular: 'Mahape Biomethanation Plant',
    humanShare: '0%',
    circularShare: '100%',
    tempRequirement: 'Ambient Bulk Transport',
    decayMinutes: 720,
  },
];

export const UrbanLoopVisualizer: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setSelectedScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const current = SCENARIOS[selectedScenarioIndex];

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10 rounded-2xl border border-slate-800/90 bg-slate-950/85 backdrop-blur-2xl p-5 sm:p-8 overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)]">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header telemetry and scenario tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold tracking-wider uppercase text-emerald-400">
              URBAN FOOD-FLOW INTELLIGENCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Live simulation: Surplus Detection → AI Dual-Stream Routing → Zero Landfill
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIndex(idx);
                setIsAutoPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                selectedScenarioIndex === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Demo #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Connected Flow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-8 items-center relative">
        {/* SVG Flow Vectors (Visible on large screens) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="flowEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="flowAmber" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Left to Center Vector */}
            <path
              d="M 280 120 L 360 120"
              stroke="url(#flowEmerald)"
              strokeWidth="2"
              fill="none"
              className="animate-flow-beam"
            />

            {/* Center to Right Top Vector (Human) */}
            <path
              d="M 640 100 Q 680 80, 720 70"
              stroke="url(#flowEmerald)"
              strokeWidth="2"
              fill="none"
              className="animate-flow-beam"
            />

            {/* Center to Right Bottom Vector (Circular) */}
            <path
              d="M 640 140 Q 680 160, 720 170"
              stroke="url(#flowAmber)"
              strokeWidth="2"
              fill="none"
              className="animate-flow-beam"
            />
          </svg>
        </div>

        {/* COLUMN 1: Surplus Source (Left) */}
        <div className="lg:col-span-4 space-y-3 relative z-10">
          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>1. Commercial Surplus Source</span>
          </div>

          <div className="p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/80 shadow-lg relative overflow-hidden group transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold">
                {current.sourceType}
              </span>
              <span className="text-xs font-mono text-indigo-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                DETECTED
              </span>
            </div>

            <h4 className="text-base font-bold text-white leading-tight">
              {current.source}
            </h4>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              {current.item}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Total Volume:</span>
              <span className="text-white font-bold">{current.quantity}</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: RasoiGrid Intelligence Layer (Center) */}
        <div className="lg:col-span-4 space-y-3 relative z-10">
          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Intelligence Core</span>
          </div>

          <div className="p-5 rounded-xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-slate-900/90 shadow-[0_0_30px_rgba(16,185,129,0.12)] relative overflow-hidden text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Layers className="w-5 h-5" />
            </div>

            <div>
              <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wide">
                Surplus Classification & Routing
              </div>
              <div className="text-[11px] text-slate-300 font-sans mt-0.5">
                {current.aiClassification}
              </div>
            </div>

            {/* Split Allocation Gauge */}
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-around font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">People First</span>
                <span className="text-emerald-400 font-bold">{current.humanShare}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Circular Bio</span>
                <span className="text-amber-400 font-bold">{current.circularShare}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-cyan-400" />
                {current.tempRequirement}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                {current.decayMinutes}m window
              </span>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Dual Recovery Streams (Right) */}
        <div className="lg:col-span-4 space-y-3 relative z-10">
          <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <Recycle className="w-3.5 h-3.5 text-amber-400" />
            <span>3. Zero-Landfill Recovery</span>
          </div>

          <div className="space-y-3">
            {/* Primary: People First */}
            <div className={`p-4 rounded-xl border transition-all ${
              current.humanShare !== '0%'
                ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 to-slate-900/60'
                : 'border-slate-800 bg-slate-900/30 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-400" />
                  PRIORITY 1: PEOPLE FIRST
                </span>
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {current.humanShare}
                </span>
              </div>
              <p className="text-xs text-white font-medium truncate">
                {current.destinationHuman}
              </p>
            </div>

            {/* Secondary: Circular Recovery */}
            <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-slate-900/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  PRIORITY 2: CIRCULAR BIO-LOOP
                </span>
                <span className="text-xs font-mono font-bold text-amber-300">
                  {current.circularShare}
                </span>
              </div>
              <p className="text-xs text-white font-medium truncate">
                {current.destinationCircular}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Principle Bar */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-slate-500 font-semibold">Hierarchy:</span>
          <span className="text-emerald-400 font-semibold">People First</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-400 font-semibold">Circular Recovery</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-rose-400 line-through">Landfill Last</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>100% Diverted from Open Landfill</span>
        </div>
      </div>
    </div>
  );
};
