import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Recycle, 
  Heart, 
  Flame, 
  ShieldCheck, 
  BarChart3, 
  Building2, 
  Utensils, 
  CheckCircle2 
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { MetricTile } from '../../components/ui/MetricTile';
import { LivePulse } from '../../components/ui/LivePulse';
import { StatusPill } from '../../components/ui/StatusPill';
import { useRescueStore } from '../../stores/useRescueStore';

export const LandingPage: React.FC = () => {
  const { surplusList, impactMetrics } = useRescueStore();
  const [calculatorMeals, setCalculatorMeals] = useState<number>(350);

  // Calculated estimates
  const estMethaneAvoided = (calculatorMeals * 0.4 * 1.8).toFixed(1);
  const estWaterSaved = (calculatorMeals * 0.4 * 100).toLocaleString();
  const estCostTaxOffset = (calculatorMeals * 45).toLocaleString('en-IN');

  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI-POWERED PREDICTIVE FOOD RESCUE & CIRCULAR RECOVERY</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
            The Urban Food Loop.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Zero Landfill. Zero Hunger.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            RasoiGrid closes the city food loop: anticipating surplus before cooking ends, dispatching cold-chain electric fleets in real-time, and routing non-edibles to circular bio-methanation.
          </p>

          {/* Engine Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-xs font-semibold py-2">
            <span className="px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> PREDICT
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> ROUTE
            </span>
            <span className="text-slate-600">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
              <Recycle className="w-3.5 h-3.5" /> RECOVER
            </span>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/app/command"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group font-mono text-sm"
            >
              <span>LAUNCH LIVE COMMAND MAP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/app/donations"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Commercial Kitchen Intake</span>
            </Link>
          </div>
        </div>

        {/* Live City Pulse Ticker Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          <MetricTile
            label="Total Meals Recovered"
            value={impactMetrics?.totalMealsRecovered || 482930}
            unit="Meals"
            delta="+1,240 Today"
            theme="emerald"
            icon={Utensils}
          />
          <MetricTile
            label="Methane (CH4) Avoided"
            value={impactMetrics?.methaneAvoidedKg || 34770}
            unit="kg CH4"
            delta="99.4% Landfill Avoidance"
            theme="cyan"
            icon={Recycle}
          />
          <MetricTile
            label="CO2e Carbon Offset"
            value={impactMetrics?.co2eAvoidedTons || 425.8}
            unit="Tons CO2e"
            delta="ISO 14064 Verified"
            theme="indigo"
            icon={BarChart3}
          />
          <MetricTile
            label="Active EV Rescue Fleet"
            value={impactMetrics?.activeFleetCount || 28}
            unit="EVs"
            delta="Mumbai Central Grid"
            theme="amber"
            icon={MapPin}
          />
        </div>
      </section>

      {/* 2. THE URBAN FOOD LOOP — 3-TIER CASCADE HIERARCHY */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900/60 text-slate-300 text-xs font-mono">
            <Recycle className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE RECOVERY MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            People First. Circular Recovery. Landfill Last.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            RasoiGrid follows a rigorous algorithmic cascade. Every calorie is directed to its highest ecological and social value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: People First */}
          <GlassCard glow="emerald" className="relative p-6 flex flex-col justify-between border-emerald-500/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  TIER 1 (91% Volume)
                </span>
                <Heart className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">People First</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hot, fresh, and temperature-safe surplus meals from hotels, corporate kitchens, and banquets are matched in under 8 minutes to verified shelters and community kitchens.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-2">
                <li className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Thermal cold-chain monitoring (&gt;60°C hot / &lt;4°C chilled)
                </li>
                <li className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Dietary tagging (Halal, Jain, Vegetarian, Allergens)
                </li>
                <li className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Digital OTP & QR chain of custody verification
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-emerald-400">
              Target: Shelters • Orphanages • Community Kitchens
            </div>
          </GlassCard>

          {/* Tier 2: Circular Recovery */}
          <GlassCard glow="amber" className="relative p-6 flex flex-col justify-between border-amber-500/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  TIER 2 (8.4% Volume)
                </span>
                <Recycle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Circular Upcycling</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Safe edible scraps and day-old bakery trimmings not viable for human intake are routed to local animal sanctuaries and Black Soldier Fly Larvae (BSFL) protein farms.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-2">
                <li className="flex items-center gap-2 text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Goshala & animal sanctuary feeds
                </li>
                <li className="flex items-center gap-2 text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Insect protein conversion for aquaculture
                </li>
                <li className="flex items-center gap-2 text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High-nutrient organic composting
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-amber-400">
              Target: BSFL Farms • Goshalas • Micro-Digesters
            </div>
          </GlassCard>

          {/* Tier 3: Biomethanation */}
          <GlassCard glow="cyan" className="relative p-6 flex flex-col justify-between border-cyan-500/30">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  TIER 3 (0.6% Volume)
                </span>
                <Flame className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Biogas Cogeneration</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Non-edible peelings and prep wastes are channelled to municipal anaerobic biomethanation units, generating clean renewable grid electricity instead of toxic landfill methane.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 pt-2">
                <li className="flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Methane capture & energy generation
                </li>
                <li className="flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Zero open-air landfill fermentation
                </li>
                <li className="flex items-center gap-2 text-cyan-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Carbon credits ledger tracking
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono text-cyan-400">
              Target: Municipal Biogas Plants • Cogeneration Grid
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 3. LIVE RESCUE STREAM PREVIEW */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <LivePulse color="emerald" label="LIVE SURPLUS FEED" />
              <h2 className="text-xl font-bold text-white">Real-Time City Rescues</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active food rescue missions occurring right now across Mumbai Metro
            </p>
          </div>
          <Link
            to="/app/command"
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>VIEW FULL DISPATCH MAP</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {surplusList.slice(0, 3).map((item) => (
            <GlassCard key={item.id} interactive className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <StatusPill status={item.status} />
                <StatusPill priority={item.priority} size="sm" />
              </div>

              <div>
                <h4 className="font-semibold text-white text-sm line-clamp-1">
                  {item.foodName}
                </h4>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {item.donorName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">QUANTITY</span>
                  <span className="text-emerald-400 font-semibold">{item.quantityKg} kg ({item.portions} meals)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">NEIGHBORHOOD</span>
                  <span className="text-slate-300 font-semibold">{item.location.neighborhood}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 4. ENTERPRISE ESG / ROI CALCULATOR */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <GlassCard glow="indigo" className="p-8 lg:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>COMMERCIAL DONOR IMPACT SIMULATOR</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Calculate Your Kitchen's ESG Footprint Reduction
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Hotels, cloud kitchens, and caterers partnering with RasoiGrid receive audit-certified ESG reports, Section 80G tax deductions, and automated zero-waste compliance badges.
              </p>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Average Surplus Meals / Day:</span>
                  <span className="text-xl font-bold text-emerald-400">{calculatorMeals} Meals</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={calculatorMeals}
                  onChange={(e) => setCalculatorMeals(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>50 meals (Boutique Cafe)</span>
                  <span>1,000 meals (5-Star Hotel)</span>
                  <span>2,000+ meals (Tech Campus)</span>
                </div>
              </div>
            </div>

            {/* Calculated Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Methane Prevented</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{estMethaneAvoided}</span>
                <span className="text-xs text-slate-400 ml-1">kg CH4 / month</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Water Footprint Saved</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">{estWaterSaved}</span>
                <span className="text-xs text-slate-400 ml-1">Liters / month</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80">
                <span className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Tax Offset Value</span>
                <span className="text-2xl font-bold font-mono text-amber-400">₹{estCostTaxOffset}</span>
                <span className="text-xs text-slate-400 ml-1">estimated value</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col justify-center">
                <Link
                  to="/app/donations"
                  className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-mono text-center transition-all"
                >
                  START DONATING NOW
                </Link>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
