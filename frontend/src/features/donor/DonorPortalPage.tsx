import React, { useState } from 'react';
import {
  Building2,
  Utensils,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  HeartHandshake,
  Recycle,
  Clock3,
  MapPin,
  FileText,
  ArrowRight,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import type {
  FoodCategory,
  RecoveryDestinationType,
} from '../../core/types/models';
import { useRescueStore } from '../../stores/useRescueStore';
import confetti from 'canvas-confetti';

export const DonorPortalPage: React.FC = () => {
  const { logSurplus, surplusList } = useRescueStore();

  const [donorName, setDonorName] = useState('Taj Lands End Hotel');
  const [donorType, setDonorType] = useState<any>('hotel_buffet');
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] =
    useState<FoodCategory>('cooked_meals');
  const [quantityKg, setQuantityKg] = useState<number>(45);
  const [portions, setPortions] = useState<number>(120);
  const [tempRequirement, setTempRequirement] =
    useState<
      'hot_above_60c' | 'ambient' | 'chilled_below_4c'
    >('hot_above_60c');
  const [neighborhood, setNeighborhood] = useState('Bandra West');
  const [targetDestinationType, setTargetDestinationType] =
    useState<RecoveryDestinationType>('shelter');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const applyPreset = (preset: {
    food: string;
    cat: FoodCategory;
    kg: number;
    port: number;
    temp:
      | 'hot_above_60c'
      | 'ambient'
      | 'chilled_below_4c';
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

    if (!foodName.trim()) return;

    setIsSubmitting(true);

    await logSurplus({
      donorName,
      donorType,
      foodName,
      category,
      quantityKg: Number(quantityKg),
      portions: Number(portions),
      cookedAt: new Date(
        Date.now() - 30 * 60 * 1000
      ).toISOString(),
      safeUntil: new Date(
        Date.now() + 4 * 60 * 60 * 1000
      ).toISOString(),
      tempRequirement,
      dietaryTags: ['vegetarian', 'halal'],
      location: {
        lat: 19.043,
        lng: 72.819,
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
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="min-h-full bg-[#f4f7f1] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 mb-4">
              <HeartHandshake className="w-4 h-4" />
              FOOD RESCUE NETWORK
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Give surplus food a second destination.
            </h1>

            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-slate-500">
              Tell us what food is available, where it is located,
              and how much you have. RasoiGrid helps coordinate the
              next recovery pathway.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Donor account
              </p>
              <p className="text-sm font-semibold text-slate-800">
                {donorName}
              </p>
            </div>
          </div>
        </div>

        {/* Three principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Utensils className="w-5 h-5 text-emerald-600" />
            </div>

            <h3 className="font-semibold text-slate-900">
              Share edible surplus
            </h3>

            <p className="text-xs leading-5 text-slate-500 mt-1">
              Make suitable surplus visible before it becomes waste.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <HeartHandshake className="w-5 h-5 text-amber-600" />
            </div>

            <h3 className="font-semibold text-slate-900">
              People first
            </h3>

            <p className="text-xs leading-5 text-slate-500 mt-1">
              Eligible food can be coordinated with verified community
              receivers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-lime-100 p-5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center mb-4">
              <Recycle className="w-5 h-5 text-lime-700" />
            </div>

            <h3 className="font-semibold text-slate-900">
              Recovery when needed
            </h3>

            <p className="text-xs leading-5 text-slate-500 mt-1">
              Unavoidable organic material can move toward circular
              recovery.
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

          {/* Main form */}
          <div className="xl:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Form header */}
              <div className="px-6 sm:px-8 py-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <PackageCheck className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Log food surplus
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                      A few details help us prepare the right recovery path.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">

                {/* Presets */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Quick examples
                      </p>
                      <p className="text-xs text-slate-400">
                        Start with a common surplus type.
                      </p>
                    </div>

                    <Sparkles className="w-4 h-4 text-emerald-500" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        applyPreset({
                          food: 'Shahi Paneer, Dal Makhani & Jeera Rice',
                          cat: 'cooked_meals',
                          kg: 60,
                          port: 160,
                          temp: 'hot_above_60c',
                          dest: 'shelter',
                        })
                      }
                      className="text-left p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition"
                    >
                      <div className="text-2xl mb-2">🍛</div>

                      <p className="text-sm font-semibold text-slate-800">
                        Dinner surplus
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        60 kg · 160 portions · Hot
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyPreset({
                          food: 'Brioche Buns, Croissants & Sandwiches',
                          cat: 'bakery_grains',
                          kg: 25,
                          port: 80,
                          temp: 'ambient',
                          dest: 'community_kitchen',
                        })
                      }
                      className="text-left p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition"
                    >
                      <div className="text-2xl mb-2">🥐</div>

                      <p className="text-sm font-semibold text-slate-800">
                        Bakery surplus
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        25 kg · 80 portions · Ambient
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        applyPreset({
                          food: 'Vegetable Peels & Kitchen Prep Trimmings',
                          cat: 'non_edible_organic',
                          kg: 180,
                          port: 0,
                          temp: 'ambient',
                          dest: 'biogas_plant',
                        })
                      }
                      className="text-left p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-lime-50 hover:border-lime-200 transition"
                    >
                      <div className="text-2xl mb-2">🥬</div>

                      <p className="text-sm font-semibold text-slate-800">
                        Kitchen scraps
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        180 kg · Organic recovery
                      </p>
                    </button>

                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  {/* Donor details */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-slate-800">
                        Where is the surplus coming from?
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Establishment name
                        </label>

                        <input
                          type="text"
                          value={donorName}
                          onChange={(e) =>
                            setDonorName(e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Establishment type
                        </label>

                        <select
                          value={donorType}
                          onChange={(e) =>
                            setDonorType(e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                        >
                          <option value="hotel_buffet">
                            Hotel / Buffet
                          </option>
                          <option value="corporate_cafeteria">
                            Corporate Cafeteria
                          </option>
                          <option value="restaurant">
                            Restaurant / Cloud Kitchen
                          </option>
                          <option value="supermarket">
                            Supermarket / Retail
                          </option>
                          <option value="event_caterer">
                            Event / Wedding Caterer
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Neighborhood
                        </label>

                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                          <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) =>
                              setNeighborhood(e.target.value)
                            }
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Food details */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Utensils className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-slate-800">
                        Tell us about the food
                      </h3>
                    </div>

                    <div className="space-y-4">

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Food description
                        </label>

                        <input
                          type="text"
                          placeholder="e.g. Biryani, salads, fresh flatbreads"
                          value={foodName}
                          onChange={(e) =>
                            setFoodName(e.target.value)
                          }
                          required
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-2">
                            Food category
                          </label>

                          <select
                            value={category}
                            onChange={(e) =>
                              setCategory(
                                e.target.value as FoodCategory
                              )
                            }
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                          >
                            <option value="cooked_meals">
                              Cooked meals
                            </option>
                            <option value="bakery_grains">
                              Bakery & grains
                            </option>
                            <option value="fresh_produce">
                              Fresh produce
                            </option>
                            <option value="dairy_cold">
                              Dairy & cold foods
                            </option>
                            <option value="packaged_dry">
                              Packaged dry goods
                            </option>
                            <option value="non_edible_organic">
                              Organic scraps
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-2">
                            Quantity (kg)
                          </label>

                          <input
                            type="number"
                            value={quantityKg}
                            onChange={(e) => {
                              const kg = Number(e.target.value);

                              setQuantityKg(kg);
                              setPortions(
                                Math.round(kg * 2.8)
                              );
                            }}
                            min="1"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-2">
                            Estimated portions
                          </label>

                          <input
                            type="number"
                            value={portions}
                            onChange={(e) =>
                              setPortions(
                                Number(e.target.value)
                              )
                            }
                            min="0"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                          />
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Handling */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock3 className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-slate-800">
                        Handling & recovery
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Current temperature condition
                        </label>

                        <select
                          value={tempRequirement}
                          onChange={(e) =>
                            setTempRequirement(
                              e.target.value as
                                | 'hot_above_60c'
                                | 'ambient'
                                | 'chilled_below_4c'
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                        >
                          <option value="hot_above_60c">
                            Hot insulated (&gt;60°C)
                          </option>
                          <option value="ambient">
                            Ambient
                          </option>
                          <option value="chilled_below_4c">
                            Chilled (&lt;4°C)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">
                          Preferred recovery destination
                        </label>

                        <select
                          value={targetDestinationType}
                          onChange={(e) =>
                            setTargetDestinationType(
                              e.target.value as RecoveryDestinationType
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                        >
                          <option value="shelter">
                            Community shelter
                          </option>
                          <option value="community_kitchen">
                            Community kitchen / food bank
                          </option>
                          <option value="animal_sanctuary">
                            Animal recovery
                          </option>
                          <option value="biogas_plant">
                            Biogas facility
                          </option>
                          <option value="compost_facility">
                            Compost facility
                          </option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* Safety note */}
                  <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />

                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Food handling note
                      </p>

                      <p className="text-xs leading-5 text-amber-800/80 mt-1">
                        This information supports coordination and
                        prioritization. Final food-safety decisions remain
                        with authorized personnel and receiving organizations.
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || !foodName.trim()
                    }
                    className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 px-5 font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Logging surplus...
                      </>
                    ) : (
                      <>
                        Log surplus & find recovery
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="xl:col-span-4 space-y-6">

            {/* Impact */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Estimated impact
                  </h3>

                  <p className="text-xs text-slate-400">
                    Based on this entry
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-700">
                    Organic waste avoided
                  </p>

                  <p className="text-2xl font-bold text-emerald-800 mt-1">
                    {quantityKg.toLocaleString()} kg
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs text-slate-400">
                      Portions
                    </p>

                    <p className="text-xl font-bold text-slate-800 mt-1">
                      {portions.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-xs text-slate-400">
                      Estimated CH₄
                    </p>

                    <p className="text-xl font-bold text-slate-800 mt-1">
                      {(quantityKg * 1.8).toFixed(1)}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      kg planning estimate
                    </p>
                  </div>

                </div>

                <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">
                  <p className="text-xs text-sky-700">
                    Estimated water footprint represented
                  </p>

                  <p className="text-xl font-bold text-sky-800 mt-1">
                    {(quantityKg * 100).toLocaleString()} L
                  </p>
                </div>

              </div>

              <p className="text-[11px] text-slate-400 leading-5 mt-4">
                These are planning estimates shown to help understand
                potential environmental impact. They are not measured
                outcomes.
              </p>
            </div>

            {/* Today's batches */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />

                  <h3 className="font-bold text-slate-900">
                    Recent surplus
                  </h3>
                </div>

                <span className="text-xs text-slate-400">
                  Today
                </span>
              </div>

              <div className="space-y-3">

                {surplusList.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-emerald-700">
                        {item.id}
                      </span>

                      <span className="text-xs font-semibold text-slate-500">
                        {item.quantityKg} kg
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-800 mt-2 truncate">
                      {item.foodName}
                    </p>

                    <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {item.location.neighborhood}
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Principle */}
            <div className="rounded-3xl bg-emerald-900 p-6 text-white">
              <HeartHandshake className="w-7 h-7 text-emerald-300 mb-4" />

              <h3 className="text-lg font-bold">
                People first.
              </h3>

              <p className="text-sm text-emerald-100/80 leading-6 mt-2">
                When surplus is suitable for people, the system
                prioritizes verified community recovery before
                circular disposal pathways.
              </p>

              <div className="flex items-center gap-2 mt-5 text-xs font-medium text-emerald-200">
                <span>People first</span>
                <span>•</span>
                <span>Circular recovery</span>
                <span>•</span>
                <span>Landfill last</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-7 text-center">

            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Surplus logged successfully
            </h3>

            <p className="text-sm leading-6 text-slate-500 mt-3">
              Your surplus has been added to the current rescue
              workflow. Matching and routing can now use the details
              you provided.
            </p>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <div>
                  <p className="text-xs text-emerald-700">
                    Surplus recorded
                  </p>

                  <p className="text-sm font-semibold text-emerald-900">
                    {quantityKg} kg · {portions} portions
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setFoodName('');
              }}
              className="w-full mt-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              Log another surplus
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
};