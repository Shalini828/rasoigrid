import React, { useState } from 'react';
import { 
  Building2, 
  Utensils, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  FileText, 
  Award
} from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import type { FoodCategory, RecoveryDestinationType } from '../../core/types/models';
import { useRescueStore } from '../../stores/useRescueStore';
import confetti from 'canvas-confetti';

export const DonorPortalPage: React.FC = () => {
  const { logSurplus, surplusList } = useRescueStore();
  
  // Form State
  const [donorName, setDonorName] = useState('Taj Lands End Hotel');
  const [donorType, setDonorType] = useState<any>('hotel_buffet');
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('cooked_meals');
  const [quantityKg, setQuantityKg] = useState<number>(45);
  const [portions, setPortions] = useState<number>(120);
  const [tempRequirement, setTempRequirement] = useState<'hot_above_60c' | 'ambient' | 'chilled_below_4c'>('hot_above_60c');
  const [neighborhood, setNeighborhood] = useState('Bandra West');
  const [targetDestinationType, setTargetDestinationType] = useState<RecoveryDestinationType>('shelter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Quick Preset Handlers
  const applyPreset = (preset: {
    name: string;
    food: string;
    cat: FoodCategory;
    kg: number;
    port: number;
    temp: 'hot_above_60c' | 'ambient' | 'chilled_below_4c';
    dest: RecoveryDestinationType;
  }) => {
    setFoodName(preset.food);
    setCategory(preset.cat);
    setQuantityKg(preset.kg);
    setPortions(preset.port);
    setTempRequirement(preset.temp);
    setTargetDestinationType(preset.dest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName) return;

    setIsSubmitting(true);
    await logSurplus({
      donorName,
      donorType,
      foodName,
      category,
      quantityKg: Number(quantityKg),
      portions: Number(portions),
      cookedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      safeUntil: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      tempRequirement,
      dietaryTags: ['vegetarian', 'halal'],
      location: {
        lat: 19.0430,
        lng: 72.8190,
        address: 'BJ Road, Bandra Bandstand',
        neighborhood,
        city: 'Mumbai',
      },
      priority: quantityKg > 50 ? 'critical' : 'high',
      confidenceScore: 98,
      targetDestinationType,
    });

    setIsSubmitting(false);
    setShowSuccessModal(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              COMMERCIAL INTAKE TERMINAL
            </span>
            <h1 className="text-xl font-bold text-white font-mono">
              Log Commercial Surplus Intake
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Instant dispatch matching with verifiable ESG carbon offset accounting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>FSSAI Certified Donor #MH-9941</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left, Quick Presets & ESG Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-8">
          <GlassCard glow="emerald" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
                <Utensils className="w-4 h-4 text-emerald-400" />
                <span>SURPLUS MANIFEST</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">STEP 1 OF 1</span>
            </div>

            {/* Quick AI Presets */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-2">
                SMART ONE-CLICK PRESETS (COMMONLY PREPARED SURPLUS):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset({
                    name: 'Buffet Main Course',
                    food: 'Shahi Paneer, Dal Makhani & Jeera Rice',
                    cat: 'cooked_meals',
                    kg: 60,
                    port: 160,
                    temp: 'hot_above_60c',
                    dest: 'shelter',
                  })}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-emerald-500/50 hover:bg-slate-900 text-left transition-all group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">
                    🍛 Dinner Buffet Main
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">60 kg • 160 meals • Hot</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset({
                    name: 'Bakery Batch',
                    food: 'Brioche Buns, Croissants & Sandwiches',
                    cat: 'bakery_grains',
                    kg: 25,
                    port: 80,
                    temp: 'ambient',
                    dest: 'community_kitchen',
                  })}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-emerald-500/50 hover:bg-slate-900 text-left transition-all group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">
                    🥐 Cafe / Bakery Surplus
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">25 kg • 80 meals • Ambient</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset({
                    name: 'Prep Scraps Bio',
                    food: 'Vegetable Peels & Kitchen Prep Trimmings',
                    cat: 'non_edible_organic',
                    kg: 180,
                    port: 0,
                    temp: 'ambient',
                    dest: 'biogas_plant',
                  })}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-emerald-500/50 hover:bg-slate-900 text-left transition-all group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-amber-300 block">
                    🌱 Kitchen Prep Scraps
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">180 kg • Biogas Co-gen</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    ESTABLISHMENT NAME
                  </label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    ESTABLISHMENT TYPE
                  </label>
                  <select
                    value={donorType}
                    onChange={(e) => setDonorType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-emerald-500"
                  >
                    <option value="hotel_buffet">5-Star / Luxury Hotel Buffet</option>
                    <option value="corporate_cafeteria">Corporate Campus Cafeteria</option>
                    <option value="restaurant">Restaurant / Cloud Kitchen</option>
                    <option value="supermarket">Supermarket / Retail Chain</option>
                    <option value="event_caterer">Banquet / Wedding Caterer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    NEIGHBORHOOD HUB
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  FOOD ITEMS DESCRIPTION
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 trays of Biryani, 40 boxed salads, fresh flatbreads"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    FOOD CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodCategory)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cooked_meals">Cooked Hot Meals</option>
                    <option value="bakery_grains">Bakery & Grains</option>
                    <option value="fresh_produce">Fresh Produce / Fruits</option>
                    <option value="dairy_cold">Cold Dairy & Salads</option>
                    <option value="packaged_dry">Packaged Dry Goods</option>
                    <option value="non_edible_organic">Non-Edible Prep Scraps</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    QUANTITY (KG)
                  </label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={(e) => {
                      const kg = Number(e.target.value);
                      setQuantityKg(kg);
                      setPortions(Math.round(kg * 2.8));
                    }}
                    min="1"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    ESTIMATED PORTIONS
                  </label>
                  <input
                    type="number"
                    value={portions}
                    onChange={(e) => setPortions(Number(e.target.value))}
                    min="0"
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    TEMPERATURE PROTOCOL
                  </label>
                  <select
                    value={tempRequirement}
                    onChange={(e) => setTempRequirement(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-emerald-500"
                  >
                    <option value="hot_above_60c">Hot Insulated (&gt;60°C)</option>
                    <option value="ambient">Ambient Safe (Room Temp)</option>
                    <option value="chilled_below_4c">Refrigerated Cold-Chain (&lt;4°C)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    TARGET RECOVERY TIER
                  </label>
                  <select
                    value={targetDestinationType}
                    onChange={(e) => setTargetDestinationType(e.target.value as RecoveryDestinationType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-sans focus:outline-none focus:border-emerald-500"
                  >
                    <option value="shelter">People First: Community Shelter</option>
                    <option value="community_kitchen">People First: Food Bank / Kitchen</option>
                    <option value="animal_sanctuary">Circular: Animal Sanctuary / Goshala</option>
                    <option value="biogas_plant">Circular: Biogas Cogeneration</option>
                    <option value="compost_facility">Circular: Aerobic Composting</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Food Safety Declaration: Handover confirms preparation was conducted under standard commercial hygiene protocols.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !foodName}
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 font-mono"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'DISPATCHING MANIFEST...' : 'TRANSMIT MANIFEST & SUMMON RESCUE FLEET'}</span>
              </button>
            </form>
          </GlassCard>
        </div>

        {/* ESG Impact Preview & Recent Donations */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard glow="cyan" className="p-5 space-y-4">
            <h4 className="font-bold text-white text-sm font-mono flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>INSTANT ESG CALCULATION</span>
            </h4>
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Methane Avoided:</span>
                <span className="text-emerald-400 font-bold">{(quantityKg * 1.8).toFixed(1)} kg CH4</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Water Footprint:</span>
                <span className="text-cyan-400 font-bold">{(quantityKg * 100).toLocaleString()} Liters</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400">Tax Credit Equivalent:</span>
                <span className="text-amber-400 font-bold">₹{(portions * 45).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon pickup, an immutable Section 80G tax receipt and carbon offset certificate will be emailed directly to your accounts department.
            </p>
          </GlassCard>

          {/* Recent Manifests */}
          <GlassCard glow="none" className="p-4 space-y-3">
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Today's Logged Batches</span>
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {surplusList.slice(0, 3).map(item => (
                <div key={item.id} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-emerald-400 font-semibold">{item.id}</span>
                    <span className="text-slate-400">{item.quantityKg} kg</span>
                  </div>
                  <div className="text-white text-xs truncate mt-0.5">{item.foodName}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <GlassCard glow="emerald" className="max-w-md w-full p-6 text-center space-y-4 border-emerald-500/40">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-xl font-bold text-white font-mono">
              Surplus Successfully Queued!
            </h3>

            <p className="text-xs text-slate-300">
              The AI dispatch engine has assigned nearest EV Rescue Van with matching thermal insulation. Driver ETA is estimated at 12 minutes.
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setFoodName('');
              }}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono transition-all"
            >
              DONE / LOG ANOTHER BATCH
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
