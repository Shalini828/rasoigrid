import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  HeartHandshake,
  Leaf,
  MapPin,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
  UtensilsCrossed,
  Users,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f7faf7] text-[#13294b]">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-[#f7faf7]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[88px] max-w-[1320px] items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50">
              <Leaf className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <div className="text-[22px] font-extrabold tracking-tight text-[#13294b]">
                RASOI<span className="text-emerald-600">GRID</span>
              </div>

              <div className="text-[10px] font-medium tracking-[0.24em] text-slate-500">
                THE URBAN FOOD LOOP
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#problem"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
            >
              The Problem
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
            >
              How It Works
            </a>

            <a
              href="#who-uses-it"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
            >
              Who Uses It
            </a>

            <a
              href="#recovery"
              className="text-sm font-medium text-slate-600 transition hover:text-emerald-600"
            >
              Circular Recovery
            </a>
          </nav>

          {/* Auth */}
          <a
            href="#choose-role"
            className="flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.12em] text-emerald-700 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md"
          >
            <Users className="mr-2 h-4 w-4 text-emerald-600" />
            <span>CHOOSE YOUR ROLE</span>
          </a>
        </div>
      </header>

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-[#f7faf7] via-white to-emerald-50/70">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-lime-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1320px] gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
            {/* Hero copy */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold tracking-[0.2em] text-emerald-700 shadow-sm">
                <Leaf className="h-4 w-4" />
                THE URBAN FOOD LOOP
              </div>

              <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-[#13294b] sm:text-6xl lg:text-[76px]">
                Food should reach
                <span className="block text-emerald-600">
                  people, not landfills.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                RasoiGrid is an urban intelligence and coordination layer that
                helps make food surplus visible, connects eligible surplus with
                verified food-rescue networks, and guides unavoidable organic
                material toward appropriate circular recovery.
              </p>

              {/* Principle pills */}
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  People First
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm">
                  <Recycle className="h-4 w-4" />
                  Circular Recovery
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm">
                  <Leaf className="h-4 w-4" />
                  Landfill Last
                </div>
              </div>

              <p className="mt-6 text-sm text-slate-500">
                Operational features are available only to authenticated users.
              </p>
            </div>

            {/* Hero pathway card */}
            <div className="relative">
              <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.08)] sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] text-emerald-600">
                      FOOD RECOVERY PATHWAY
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#13294b]">
                      From surplus to recovery
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <HeartHandshake className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <PathwayStep
                    number="01"
                    icon={<Building2 className="h-5 w-5" />}
                    title="Surplus appears"
                    description="A restaurant, hotel, cafeteria, event venue, or food business identifies available surplus."
                  />

                  <div className="ml-7 h-5 border-l border-dashed border-emerald-300" />

                  <PathwayStep
                    number="02"
                    icon={<Sparkles className="h-5 w-5" />}
                    title="Predict & route"
                    description="AI assists with prioritization, matching, forecasting, and operational recommendations."
                    highlighted
                  />

                  <div className="ml-7 h-5 border-l border-dashed border-emerald-300" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                      <HeartHandshake className="h-6 w-6 text-emerald-600" />

                      <h3 className="mt-4 font-bold text-[#13294b]">
                        People First
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Eligible food moves toward verified community receiving
                        organizations.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-lime-200 bg-lime-50/70 p-5">
                      <Recycle className="h-6 w-6 text-lime-700" />

                      <h3 className="mt-4 font-bold text-[#13294b]">Recover</h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Unavoidable organic material can move toward appropriate
                        circular recovery.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>
                    Human-verified safety decisions remain part of the handover.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CHOOSE YOUR ROLE
        ========================================================= */}
        <section
          id="choose-role"
          className="border-b border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-[1320px] px-6 py-16 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <SectionLabel icon={<Users className="h-4 w-4" />}>
                CHOOSE YOUR ROLE
              </SectionLabel>

              <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-[#13294b] sm:text-4xl">
                Enter RasoiGrid through your role.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Choose the workspace that matches what you do in the food
                recovery loop.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <LoginRoleCard
                icon={<Building2 className="h-7 w-7" />}
                role="DONOR"
                title="Login as Donor"
                description="Report surplus food and track your contributions."
              />

              <LoginRoleCard
                icon={<HeartHandshake className="h-7 w-7" />}
                role="NGO"
                title="Login as NGO"
                description="Coordinate food rescue and receiving operations."
              />

              <LoginRoleCard
                icon={<Truck className="h-7 w-7" />}
                role="VOLUNTEER"
                title="Login as Volunteer"
                description="Support pickup, dispatch, and delivery logistics."
              />

              <LoginRoleCard
                icon={<ShieldCheck className="h-7 w-7" />}
                role="ADMIN"
                title="Login as Admin"
                description="Access mission control and oversee the network."
              />
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Admin access is restricted to authorized accounts.
            </p>
          </div>
        </section>

        {/* =========================================================
            PROBLEM
        ========================================================= */}
        <section id="problem" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-28">
            <SectionLabel icon={<UtensilsCrossed className="h-4 w-4" />}>
              THE PROBLEM
            </SectionLabel>

            <div className="mt-7 max-w-4xl">
              <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.03em] text-[#13294b] sm:text-5xl">
                Surplus food is often a
                <span className="text-emerald-600"> coordination problem.</span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Food surplus can appear suddenly at hotels, restaurants,
                cafeterias, events, and food markets. The challenge is not
                simply identifying the food. It is coordinating the right
                information, receiving organization, transport pathway, timing,
                and recovery option before the opportunity is lost.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <ProblemCard
                icon={<Clock3 className="h-6 w-6" />}
                title="Timing matters"
                description="Surplus is time-sensitive. Delayed coordination can reduce the practical opportunity for recovery."
              />

              <ProblemCard
                icon={<MapPin className="h-6 w-6" />}
                title="Information is fragmented"
                description="Donors, receiving organizations, and volunteers need a shared operational picture."
              />

              <ProblemCard
                icon={<Recycle className="h-6 w-6" />}
                title="Not everything is edible"
                description="When human consumption is not appropriate, organic material still needs a better recovery pathway."
              />
            </div>
          </div>
        </section>

        {/* =========================================================
            HOW IT WORKS
        ========================================================= */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-y border-slate-200 bg-[#f4f8f5]"
        >
          <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <SectionLabel icon={<Sparkles className="h-4 w-4" />}>
                HOW IT WORKS
              </SectionLabel>

              <h2 className="mt-7 text-4xl font-extrabold tracking-[-0.03em] text-[#13294b] sm:text-5xl">
                Predict.
                <span className="text-emerald-600"> Route.</span>
                Recover.
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                RasoiGrid brings surplus reporting, AI-assisted planning,
                matching, rescue coordination, and circular recovery into one
                operational workflow.
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <ProcessCard
                number="01"
                title="Predict"
                icon={<BrainCircuit className="h-7 w-7" />}
                description="Use reported surplus information and contextual inputs to estimate urgency and support operational prioritization."
                points={[
                  "Surplus information",
                  "Quantity and timing",
                  "AI-assisted prioritization",
                ]}
              />

              <ProcessCard
                number="02"
                title="Route"
                icon={<Truck className="h-7 w-7" />}
                description="Identify suitable verified recovery pathways and help coordinate the people, organizations, and transport needed."
                points={[
                  "Verified receivers",
                  "Location-aware matching",
                  "Pickup coordination",
                ]}
                highlighted
              />

              <ProcessCard
                number="03"
                title="Recover"
                icon={<Recycle className="h-7 w-7" />}
                description="Prioritize human recovery when appropriate, then guide unavoidable organic material toward suitable circular pathways."
                points={["People first", "Organic recovery", "Landfill last"]}
              />
            </div>

            {/* Flow strip */}
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
                <FlowItem
                  icon={<UtensilsCrossed className="h-5 w-5" />}
                  title="Surplus"
                  description="Food becomes visible"
                />

                <ChevronRight className="hidden h-5 w-5 text-emerald-400 md:block" />

                <FlowItem
                  icon={<BrainCircuit className="h-5 w-5" />}
                  title="Intelligence"
                  description="Plan the next action"
                />

                <ChevronRight className="hidden h-5 w-5 text-emerald-400 md:block" />

                <FlowItem
                  icon={<HeartHandshake className="h-5 w-5" />}
                  title="Rescue"
                  description="People first"
                />

                <ChevronRight className="hidden h-5 w-5 text-emerald-400 md:block" />

                <FlowItem
                  icon={<Recycle className="h-5 w-5" />}
                  title="Recovery"
                  description="Circular pathway"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            AI INTELLIGENCE
        ========================================================= */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-28">
            <div className="text-center">
              <SectionLabel icon={<BrainCircuit className="h-4 w-4" />}>
                INTELLIGENCE LAYER
              </SectionLabel>

              <h2 className="mt-7 text-4xl font-extrabold tracking-[-0.03em] text-[#13294b] sm:text-5xl">
                AI assists the operation.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Gemini is used as an intelligence assistant for forecasting,
                prioritization, matching support, recommendations, and
                structured operational information.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <IntelligenceCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Surplus Forecasting"
                description="Assist with identifying potential surplus patterns and urgency."
              />

              <IntelligenceCard
                icon={<MapPin className="h-6 w-6" />}
                title="Contextual Routing"
                description="Support recommendations for suitable recovery and coordination pathways."
              />

              <IntelligenceCard
                icon={<CircleDot className="h-6 w-6" />}
                title="Triage Prioritization"
                description="Help prioritize time-sensitive surplus for operational attention."
              />

              <IntelligenceCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Structured Documentation"
                description="Support consistent records across donation, matching, dispatch, and recovery workflows."
              />
            </div>

            <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-slate-200 bg-[#f7faf7] p-6 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                  <ShieldCheck className="h-5 w-5 text-emerald-700" />
                </div>

                <div>
                  <h3 className="font-bold text-[#13294b]">
                    Operational integrity note
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    AI does not independently certify food safety. Final
                    food-safety decisions, physical inspection, temperature
                    checks, and handover responsibility remain with authorized
                    human personnel and receiving organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            PEOPLE FIRST
        ========================================================= */}
        <section className="border-y border-slate-200 bg-[#f4f8f5]">
          <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <SectionLabel icon={<HeartHandshake className="h-4 w-4" />}>
                  PRIMARY PRINCIPLE
                </SectionLabel>

                <h2 className="mt-7 text-4xl font-extrabold leading-tight tracking-[-0.03em] text-[#13294b] sm:text-5xl">
                  People First.
                  <span className="block text-emerald-600">
                    Nutritious meals to verified communities.
                  </span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  When surplus is appropriate for human recovery, RasoiGrid
                  prioritizes coordination with verified receiving organizations
                  before circular disposal pathways.
                </p>

                <div className="mt-8 space-y-5">
                  <FeatureRow
                    title="Verified organization network"
                    description="Receiving organizations can be represented with their available capacity and verification status."
                  />

                  <FeatureRow
                    title="Food-safety aware workflow"
                    description="The platform supports documentation and coordination without replacing human safety decisions."
                  />

                  <FeatureRow
                    title="Digital chain of custody"
                    description="Operational events can be structured across requests, dispatch, pickup, delivery, and recovery."
                  />
                </div>
              </div>

              {/* Workflow visual */}
              <div className="rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.07)] sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.18em] text-slate-500">
                    INTAKE WORKFLOW
                  </p>

                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    HUMAN-VERIFIED HANDOVER
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <InfoRow
                    label="Surplus reported"
                    value="Food type • quantity • timing"
                  />

                  <InfoRow
                    label="AI assistance"
                    value="Priority • urgency • recommendation"
                    highlighted
                  />

                  <InfoRow
                    label="Recovery pathway"
                    value="Verified community receiver"
                  />

                  <InfoRow
                    label="Operational handover"
                    value="Human safety decision"
                  />
                </div>

                <div className="mt-6 rounded-xl bg-emerald-50 p-5">
                  <p className="text-sm leading-6 text-emerald-900">
                    The goal is simple: make eligible surplus visible early
                    enough for people and organizations to act on it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            WHO USES IT
        ========================================================= */}
        <section id="who-uses-it" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <SectionLabel icon={<Users className="h-4 w-4" />}>
                WHO USES IT
              </SectionLabel>

              <h2 className="mt-7 text-4xl font-extrabold tracking-[-0.03em] text-[#13294b] sm:text-5xl">
                One loop.
                <span className="text-emerald-600"> Multiple roles.</span>
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                RasoiGrid coordinates different participants around the same
                recovery workflow while keeping role-based access and
                responsibilities clear.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <RoleCard
                icon={<Building2 className="h-7 w-7" />}
                title="Food Donors"
                description="Hotels, restaurants, cafeterias, event venues, and other food businesses can report surplus and provide the information needed for recovery coordination."
              />

              <RoleCard
                icon={<HeartHandshake className="h-7 w-7" />}
                title="Community Receivers"
                description="Verified NGOs and community organizations can view suitable surplus, manage rescue requests, and coordinate receiving operations."
              />

              <RoleCard
                icon={<Truck className="h-7 w-7" />}
                title="Rescue Volunteers"
                description="Volunteers can support the physical movement of surplus through coordinated pickup and dispatch workflows."
              />
            </div>

            <div className="mt-10 rounded-2xl border border-slate-200 bg-[#f7faf7] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Operational tools are intentionally behind authentication so
                  actions such as reporting, matching, requests, dispatch, and
                  status updates are associated with the appropriate user role.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CIRCULAR RECOVERY
        ========================================================= */}
        <section
          id="recovery"
          className="scroll-mt-24 border-y border-slate-200 bg-[#f4f8f5]"
        >
          <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-28">
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
              {/* Recovery pathways */}
              <div className="rounded-[28px] border border-lime-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-[0.18em] text-slate-500">
                    CIRCULAR STREAM PATHWAYS
                  </p>

                  <div className="inline-flex items-center gap-2 text-xs font-bold text-lime-700">
                    <Recycle className="h-4 w-4" />
                    RECOVERY
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <RecoveryCard
                    icon="♨"
                    title="Biogas"
                    description="Organic material toward anaerobic recovery pathways."
                  />

                  <RecoveryCard
                    icon="↯"
                    title="Bio-conversion"
                    description="Suitable organic material toward other recovery pathways."
                  />

                  <RecoveryCard
                    icon="♻"
                    title="Composting"
                    description="Organic material toward appropriate soil recovery."
                  />
                </div>

                <div className="mt-6 rounded-2xl border border-lime-200 bg-lime-50 p-5">
                  <p className="text-sm leading-6 text-lime-900">
                    Circular recovery is the second pathway when human
                    consumption is not appropriate. The exact destination
                    depends on the material and applicable requirements.
                  </p>
                </div>
              </div>

              {/* Copy */}
              <div>
                <SectionLabel icon={<Recycle className="h-4 w-4" />}>
                  CIRCULAR RECOVERY
                </SectionLabel>

                <h2 className="mt-7 text-4xl font-extrabold leading-tight tracking-[-0.03em] text-[#13294b] sm:text-5xl">
                  When human consumption is not an option,
                  <span className="text-lime-700">
                    {" "}
                    recovery still matters.
                  </span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Kitchen preparation scraps, unsuitable organic material, and
                  other unavoidable residues can be directed toward appropriate
                  circular recovery pathways instead of being treated as the
                  default endpoint.
                </p>

                <div className="mt-8 space-y-5">
                  <FeatureRow
                    title="Organic recovery"
                    description="Support pathways such as composting, biogas, or other suitable recovery systems."
                  />

                  <FeatureRow
                    title="Landfill last"
                    description="The platform's hierarchy places recovery ahead of landfill disposal where appropriate."
                  />

                  <FeatureRow
                    title="Material-aware decisions"
                    description="Recovery recommendations remain subject to the characteristics of the material and applicable requirements."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            RECOVERY HIERARCHY
        ========================================================= */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-28">
            <div className="text-center">
              <SectionLabel icon={<Leaf className="h-4 w-4" />}>
                RECOVERY HIERARCHY
              </SectionLabel>

              <h2 className="mt-7 text-4xl font-extrabold tracking-[-0.03em] text-[#13294b] sm:text-5xl">
                People first.
                <span className="text-emerald-600"> Recovery second.</span>
              </h2>
            </div>

            <div className="mx-auto mt-14 max-w-5xl">
              <div className="grid gap-5 md:grid-cols-3">
                <HierarchyCard
                  step="01"
                  title="People First"
                  description="Eligible surplus is prioritized for verified human recovery pathways."
                  icon={<HeartHandshake className="h-7 w-7" />}
                  active
                />

                <HierarchyCard
                  step="02"
                  title="Circular Recovery"
                  description="Unavoidable organic material can move toward suitable recovery pathways."
                  icon={<Recycle className="h-7 w-7" />}
                />

                <HierarchyCard
                  step="03"
                  title="Landfill Last"
                  description="Landfill is treated as the last destination rather than the first response."
                  icon={<Leaf className="h-7 w-7" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL PROJECT STATEMENT
        ========================================================= */}
        <section className="px-6 pb-20 lg:px-8 lg:pb-28">
          <div className="mx-auto max-w-[1320px]">
            <div className="overflow-hidden rounded-[32px] bg-emerald-700 px-7 py-16 text-center text-white shadow-[0_25px_70px_rgba(16,185,129,0.18)] sm:px-12">
              <div className="mx-auto max-w-3xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                  <Leaf className="h-7 w-7" />
                </div>

                <h2 className="mt-7 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">
                  Make food surplus visible.
                </h2>

                <p className="mt-5 text-lg leading-8 text-emerald-50">
                  RasoiGrid brings prediction, coordination, rescue, and
                  circular recovery into one urban food loop.
                </p>

                <div className="mt-8 text-sm font-medium text-emerald-100">
                  PREDICT → ROUTE → RECOVER
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          SINGLE FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-12 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <div className="font-extrabold text-[#13294b]">
                    RASOI<span className="text-emerald-600">GRID</span>
                  </div>

                  <div className="text-[9px] tracking-[0.2em] text-slate-500">
                    THE URBAN FOOD LOOP
                  </div>
                </div>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-500">
                An urban intelligence and coordination layer for food surplus,
                rescue, and circular recovery.
              </p>

              <div className="mt-5 text-xs font-medium text-slate-400">
                People first · Circular recovery · Landfill last
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-bold text-[#13294b]">Explore</h3>

              <div className="mt-4 space-y-3">
                <a
                  href="#problem"
                  className="block text-sm text-slate-500 transition hover:text-emerald-600"
                >
                  The Problem
                </a>

                <a
                  href="#how-it-works"
                  className="block text-sm text-slate-500 transition hover:text-emerald-600"
                >
                  How It Works
                </a>

                <a
                  href="#who-uses-it"
                  className="block text-sm text-slate-500 transition hover:text-emerald-600"
                >
                  Who Uses It
                </a>

                <a
                  href="#recovery"
                  className="block text-sm text-slate-500 transition hover:text-emerald-600"
                >
                  Circular Recovery
                </a>
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="font-bold text-[#13294b]">Account</h3>

              <div className="mt-4 space-y-3">
                <Link
                  to="/login"
                  className="block text-sm text-slate-500 transition hover:text-emerald-600"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="block text-sm text-slate-500 transition hover:text-emerald-600"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 RasoiGrid. The Urban Food Loop.</span>

            <span>
              AI-assisted coordination · Human-verified safety decisions
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* =============================================================
   SMALL COMPONENTS
============================================================= */

interface SectionLabelProps {
  children: React.ReactNode;
  icon: React.ReactNode;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ children, icon }) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold tracking-[0.18em] text-emerald-700">
      {icon}
      {children}
    </div>
  );
};

interface PathwayStepProps {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
}

const PathwayStep: React.FC<PathwayStepProps> = ({
  number,
  icon,
  title,
  description,
  highlighted = false,
}) => {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlighted
          ? "border-emerald-200 bg-emerald-50/70"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            highlighted
              ? "bg-white text-emerald-600"
              : "bg-white text-emerald-600"
          }`}
        >
          {icon}
        </div>

        <div>
          <div className="text-xs font-bold tracking-wide text-slate-400">
            {number}
          </div>

          <h3 className="mt-1 font-bold text-[#13294b]">{title}</h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

interface ProblemCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#13294b]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
};

interface ProcessCardProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  points: string[];
  highlighted?: boolean;
}

const ProcessCard: React.FC<ProcessCardProps> = ({
  number,
  title,
  icon,
  description,
  points,
  highlighted = false,
}) => {
  return (
    <div
      className={`rounded-[24px] border p-7 shadow-sm ${
        highlighted
          ? "border-emerald-300 bg-white shadow-[0_20px_50px_rgba(16,185,129,0.08)]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
            highlighted
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {number} // {title.toUpperCase()}
        </div>

        <div className="text-emerald-600">{icon}</div>
      </div>

      <h3 className="mt-7 text-2xl font-bold text-[#13294b]">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>

      <div className="mt-6 border-t border-slate-200 pt-5">
        <div className="space-y-3">
          {points.map((point) => (
            <div
              key={point}
              className="flex items-center gap-2 text-sm font-medium text-slate-600"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {point}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface IntelligenceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const IntelligenceCard: React.FC<IntelligenceCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-[#13294b]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
};

interface FeatureRowProps {
  title: string;
  description: string;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ title, description }) => {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

      <div>
        <h3 className="font-bold text-[#13294b]">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
  highlighted?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  highlighted = false,
}) => {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlighted
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <span className="text-sm font-medium text-slate-500">{label}</span>

        <span
          className={`text-sm font-bold ${
            highlighted ? "text-emerald-700" : "text-[#13294b]"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

interface LoginRoleCardProps {
  icon: React.ReactNode;
  role: "DONOR" | "NGO" | "VOLUNTEER" | "ADMIN";
  title: string;
  description: string;
}

const LoginRoleCard: React.FC<LoginRoleCardProps> = ({
  icon,
  role,
  title,
  description,
}) => {
  return (
    <Link
      to={`/login?role=${role}`}
      className="group rounded-[24px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
          {icon}
        </div>

        <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
      </div>

      <div className="mt-5 text-xs font-bold tracking-[0.16em] text-emerald-600">
        {role}
      </div>

      <h3 className="mt-2 text-lg font-bold text-[#13294b]">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-5 text-sm font-semibold text-emerald-700">
        Continue to sign in →
      </div>
    </Link>
  );
};

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description }) => {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#13294b]">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
};

interface RecoveryCardProps {
  icon: string;
  title: string;
  description: string;
}

const RecoveryCard: React.FC<RecoveryCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#f8fbf8] p-5 text-center">
      <div className="text-2xl">{icon}</div>

      <h3 className="mt-4 font-bold text-[#13294b]">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
};

interface HierarchyCardProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  active?: boolean;
}

const HierarchyCard: React.FC<HierarchyCardProps> = ({
  step,
  title,
  description,
  icon,
  active = false,
}) => {
  return (
    <div
      className={`rounded-[24px] border p-7 ${
        active
          ? "border-emerald-300 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-bold tracking-[0.18em] ${
            active ? "text-emerald-700" : "text-slate-400"
          }`}
        >
          {step}
        </span>

        <div className={`${active ? "text-emerald-600" : "text-slate-500"}`}>
          {icon}
        </div>
      </div>

      <h3 className="mt-6 text-xl font-bold text-[#13294b]">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
};

interface FlowItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FlowItem: React.FC<FlowItemProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>

      <div>
        <div className="text-sm font-bold text-[#13294b]">{title}</div>

        <div className="text-xs text-slate-500">{description}</div>
      </div>
    </div>
  );
};

export default LandingPage;
