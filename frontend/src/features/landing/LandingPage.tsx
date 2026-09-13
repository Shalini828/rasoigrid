import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Recycle, 
  Heart, 
  Flame, 
  ShieldCheck, 
  Building2, 
  Utensils, 
  CheckCircle2, 
  Cpu, 
  Compass, 
  Layers, 
  ChevronRight, 
  Activity,
  FileSpreadsheet,
  AlertCircle,
  Truck,
  Zap
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { UrbanLoopVisualizer } from './UrbanLoopVisualizer';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 sm:space-y-32 py-6 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-10 lg:pt-14">
        {/* Ambient subtle architectural grid & lighting */}
        <div className="absolute inset-0 bg-grid-subtle bg-radial-vignette opacity-70 pointer-events-none" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-28 left-1/4 w-[340px] h-[340px] bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative text-center max-w-4xl mx-auto space-y-6 z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE URBAN FOOD INTELLIGENCE PROTOCOL</span>
          </div>

          {/* Headline Hierarchy */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
              The Urban Food Loop.
            </h1>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent leading-[1.1]">
              Zero Landfill. Zero Hunger.
            </div>
          </div>

          {/* Concise Positioning Statement */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            RasoiGrid is an urban intelligence layer that predicts food surplus before it becomes waste, routes eligible surplus to verified food-rescue networks, and directs unavoidable organic waste toward circular recovery.
          </p>

          {/* Prominent Flow Triad Controller */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-xs font-semibold py-1">
            <span className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> PREDICT
            </span>
            <span className="text-slate-600 font-bold">→</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" /> ROUTE
            </span>
            <span className="text-slate-600 font-bold">→</span>
            <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 shadow-sm">
              <Recycle className="w-3.5 h-3.5 text-emerald-400" /> RECOVER
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/app/command"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2 group font-mono text-sm"
            >
              <span>Launch RasoiGrid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Central Visual: Urban Food-Flow Network */}
        <UrbanLoopVisualizer />
      </section>

      {/* 2. TRUST / LIVE SIGNAL STRIP */}
      <section id="impact" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-6 lg:p-8 rounded-2xl bg-slate-950/70 border border-slate-800/90 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                DEMO TELEMETRY & SIMULATED CITY DATA
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
              * Demonstration values illustrating urban modeling capacity
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6 font-mono">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Surplus Detected</span>
              <div className="text-2xl sm:text-3xl font-bold text-white">14,820 <span className="text-sm font-normal text-slate-400">kg/mo</span></div>
              <p className="text-[11px] text-emerald-400 font-sans">Simulated volume across 140+ kitchens</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Rescue Matches</span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400">38,400 <span className="text-sm font-normal text-slate-400">meals</span></div>
              <p className="text-[11px] text-slate-400 font-sans">Modeled human redistribution</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Organic Recovery</span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">99.4% <span className="text-sm font-normal text-slate-400">rate</span></div>
              <p className="text-[11px] text-slate-400 font-sans">Biogas & composting routing</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Landfill Avoided</span>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400">26.7 <span className="text-sm font-normal text-slate-400">t CO2e</span></div>
              <p className="text-[11px] text-slate-400 font-sans">Modeled methane abatement</p>
            </div>
          </div>
        </div>
      </section>

      {/* GRADIENT DIVIDER */}
      <div className="max-w-5xl mx-auto gradient-divider" />

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900/80 text-slate-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Predict. Route. Recover.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A continuous closed-loop architecture that turns unpredictable urban surplus into structured, timely recovery.
          </p>
        </div>

        {/* Progressive 3-Step Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1: PREDICT */}
          <GlassCard glow="indigo" className="p-7 space-y-5 flex flex-col justify-between border-indigo-500/30">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  01 // PREDICT
                </span>
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Estimate Upcoming Surplus</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Machine learning models analyze commercial catering schedules, past waste patterns, banquet bookings, and weather factors to forecast surplus before preparation finishes.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-mono text-indigo-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>Surplus anticipated 2–4 hours ahead</span>
            </div>
          </GlassCard>

          {/* Step 2: ROUTE */}
          <GlassCard glow="emerald" className="p-7 space-y-5 flex flex-col justify-between border-emerald-500/30">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  02 // ROUTE
                </span>
                <Truck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Match Verified Pathways</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Eligible surplus is instantly matched with verified shelters and community kitchens, coordinating temperature-safe transport with real-time ETA and status monitoring.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-mono text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Fast triage and logistics matching</span>
            </div>
          </GlassCard>

          {/* Step 3: RECOVER */}
          <GlassCard glow="amber" className="p-7 space-y-5 flex flex-col justify-between border-amber-500/30">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  03 // RECOVER
                </span>
                <Recycle className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Circular Upcycling</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unavoidable organic material and non-edible scraps are channelled to biomethanation units, insect protein facilities, and composting systems instead of open landfills.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-xs font-mono text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Zero-landfill organic diversion</span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* GRADIENT DIVIDER */}
      <div className="max-w-5xl mx-auto gradient-divider" />

      {/* 4. PEOPLE FIRST */}
      <section id="product" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
              <span>PRIMARY PRINCIPLE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              People First.
              <br />
              <span className="text-emerald-400">Nutritious meals to verified communities.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Every calorie suitable for human consumption is prioritized for immediate redistribution. RasoiGrid connects commercial food donors with verified non-profits, shelters, and community kitchens through disciplined food-safety workflows.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Verified Organization Network</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Audited recipient organizations with proven intake and storage capacity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Food-Safety & Thermal Protocols</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Insulated transit respecting temperature guidelines (&gt;60°C hot, &lt;4°C chilled).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Digital Chain-of-Custody</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Contactless verification between kitchen donors and receiving coordinators.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <GlassCard glow="emerald" className="p-6 lg:p-7 space-y-4 border-emerald-500/30">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">INTAKE WORKFLOW DEMO</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> HUMAN-VERIFIED HANDOVER
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/85 border border-slate-800 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Preparation Logged:</span>
                  <span className="text-white">Commercial Buffet Batch</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Safe Window Window:</span>
                  <span className="text-emerald-400 font-bold">4 Hours Remaining</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Dietary Verification:</span>
                  <span className="text-slate-200">Vegetarian • Halal Tagged</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Matched Beneficiaries:</span>
                  <span className="text-cyan-400 font-bold">180 Hot Meals</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic">
                "By coordinating surplus at peak freshness, we preserve dignity and nourishment across urban communities."
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* GRADIENT DIVIDER */}
      <div className="max-w-5xl mx-auto gradient-divider" />

      {/* 5. CIRCULAR RECOVERY */}
      <section id="circular" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <GlassCard glow="amber" className="p-6 lg:p-7 space-y-4 border-amber-500/30">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">CIRCULAR STREAM PATHWAYS</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Recycle className="w-4 h-4" /> ZERO-LANDFILL DIVERSION
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                  <Flame className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                  <span className="font-bold text-white block">Biogas Co-Gen</span>
                  <span className="text-[10px] text-slate-400">Clean Electricity</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                  <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                  <span className="font-bold text-white block">BSFL Protein</span>
                  <span className="text-[10px] text-slate-400">Animal Feed</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                  <Utensils className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                  <span className="font-bold text-white block">Composting</span>
                  <span className="text-[10px] text-slate-400">Urban Soil Humus</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                Diverting organic food scraps from landfills avoids open-air anaerobic decomposition and prevents potent methane emissions.
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono">
              <Recycle className="w-3.5 h-3.5 text-amber-400" />
              <span>CIRCULAR RECOVERY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Circular Recovery.
              <br />
              <span className="text-amber-400">When human consumption is not an option.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Kitchen prep trimmings, peelings, and unviable batches are never sent to municipal dumps. RasoiGrid directs unavoidable organic material toward licensed composting, biomethanation, and agricultural recovery pathways, subject to applicable safety requirements.
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Anaerobic Biogas Cogeneration</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Capturing methane to generate clean power and organic digestate.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Insect Protein Bio-Conversion</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Larvae bio-systems converting organic residue into animal feed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRADIENT DIVIDER */}
      <div className="max-w-5xl mx-auto gradient-divider" />

      {/* 6. AI INTELLIGENCE & FOOD-SAFETY POSITIONING */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>INTELLIGENCE LAYER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            AI-Driven Urban Coordination
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            How machine learning models assist operations, forecasting, and documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <GlassCard glow="indigo" className="p-6 space-y-3 border-indigo-500/25">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <h4 className="text-base font-bold text-white">Surplus Forecasting</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Anticipating upcoming surplus volumes using catering calendars, historical waste patterns, and weather factors.
            </p>
          </GlassCard>

          <GlassCard glow="cyan" className="p-6 space-y-3 border-cyan-500/25">
            <Compass className="w-6 h-6 text-cyan-400" />
            <h4 className="text-base font-bold text-white">Contextual Routing</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recommending optimal transit pathways based on traffic density, vehicle thermal insulation, and recipient urgency.
            </p>
          </GlassCard>

          <GlassCard glow="emerald" className="p-6 space-y-3 border-emerald-500/25">
            <Layers className="w-6 h-6 text-emerald-400" />
            <h4 className="text-base font-bold text-white">Triage Prioritization</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evaluating shelf-life decay windows to prioritize urgent hot meals over flexible ambient goods.
            </p>
          </GlassCard>

          <GlassCard glow="none" className="p-6 space-y-3 border-slate-800">
            <FileSpreadsheet className="w-6 h-6 text-slate-300" />
            <h4 className="text-base font-bold text-white">Structured Compliance</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automating digital handover records and structured donation reporting for commercial partners.
            </p>
          </GlassCard>
        </div>

        {/* Explicit Food Safety Positioning Notice */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs text-slate-300 max-w-3xl mx-auto flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-white">Operational Integrity Note:</strong> AI models assist with surplus forecasting, operational prioritization, routing recommendations, and structured documentation workflows. <strong>AI does not independently certify food safety.</strong> Human food-safety personnel and authorized receiver organizations remain responsible for physical inspection, temperature sign-off, and handover.
          </p>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <GlassCard glow="emerald" className="p-8 sm:p-14 text-center space-y-5 relative overflow-hidden border-emerald-500/40">
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Make food surplus visible.
              <br />
              <span className="text-emerald-400">Make recovery possible.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Join commercial kitchens, food rescue organizations, and circular processing hubs in closing the urban food loop.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/app/command"
              className="w-full sm:w-auto px-9 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all font-mono text-sm flex items-center justify-center gap-2 group"
            >
              <span>Enter the Food Loop</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/app/donations"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Commercial Kitchen Intake</span>
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};
