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
import { useAuthStore } from '../../stores/useAuthStore';

import confetti from 'canvas-confetti';

export const DonorPortalPage: React.FC = () => {
  const { logSurplus, surplusList } = useRescueStore();

  /*
   * Get the currently authenticated user.
   */
  const user = useAuthStore(
    (state) => state.user
  );

  /*
   * Use the registered user's name instead of
   * the old hardcoded demo donor.
   */
  const [donorName, setDonorName] = useState(
    user?.name || ''
  );

  const [donorType, setDonorType] =
    useState<any>('hotel_buffet');

  const [foodName, setFoodName] = useState('');

  const [category, setCategory] =
    useState<FoodCategory>('cooked_meals');

  const [quantityKg, setQuantityKg] =
    useState<number>(45);

  const [portions, setPortions] =
    useState<number>(120);

  const [tempRequirement, setTempRequirement] =
    useState<
      'hot_above_60c' | 'ambient' | 'chilled_below_4c'
    >('hot_above_60c');

  const [neighborhood, setNeighborhood] =
    useState('Bandra West');

  const [targetDestinationType, setTargetDestinationType] =
    useState<RecoveryDestinationType>('shelter');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

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

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!foodName.trim()) {
      return;
    }

    if (!donorName.trim()) {
      setDonorName(user?.name || '');
      return;
    }

    setIsSubmitting(true);

    try {
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

        dietaryTags: [
          'vegetarian',
          'halal',
        ],

        location: {
          lat: 19.043,
          lng: 72.819,
          address:
            'BJ Road, Bandra Bandstand',
          neighborhood,
          city: 'Mumbai',
        },

        priority:
          quantityKg > 50
            ? 'critical'
            : 'high',

        confidenceScore: 98,

        targetDestinationType,
      });

      setShowSuccessModal(true);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#f4f7f1] text-slate-800">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

          <div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

              <HeartHandshake className="h-4 w-4" />

              FOOD RESCUE NETWORK

            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Give surplus food a second destination.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Tell us what food is available, where it is located,
              and how much you have. RasoiGrid helps coordinate the
              next recovery pathway.
            </p>

          </div>

          {/* Real logged-in donor */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>

            <div>

              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Donor account
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {user?.name || donorName || 'Donor'}
              </p>

            </div>

          </div>

        </div>

        {/* =====================================================
            THREE PRINCIPLES
        ===================================================== */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Utensils className="h-5 w-5 text-emerald-600" />
            </div>

            <h3 className="font-semibold text-slate-900">
              Share edible surplus
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Make suitable surplus visible before it becomes waste.
            </p>

          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <HeartHandshake className="h-5 w-5 text-amber-600" />
            </div>

            <h3 className="font-semibold text-slate-900">
              People first
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Eligible food can be coordinated with verified community
              receivers.
            </p>

          </div>

          <div className="rounded-2xl border border-lime-100 bg-white p-5 shadow-sm">

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-lime-50">
              <Recycle className="h-5 w-5 text-lime-700" />
            </div>

            <h3 className="font-semibold text-slate-900">
              Recovery when needed
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Unavoidable organic material can move toward circular
              recovery.
            </p>

          </div>

        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">

          {/* ===================================================
              MAIN FORM
          =================================================== */}
          <div className="xl:col-span-8">

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              {/* Form header */}
              <div className="border-b border-slate-100 px-6 py-6 sm:px-8">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                    <PackageCheck className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Log food surplus
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      A few details help us prepare the right recovery path.
                    </p>

                  </div>

                </div>

              </div>

              <div className="p-6 sm:p-8">

                {/* =================================================
                    PRESETS
                ================================================= */}
                <div className="mb-8">

                  <div className="mb-3 flex items-center justify-between">

                    <div>

                      <p className="text-sm font-semibold text-slate-800">
                        Quick examples
                      </p>

                      <p className="text-xs text-slate-400">
                        Start with a common surplus type.
                      </p>

                    </div>

                    <Sparkles className="h-4 w-4 text-emerald-500" />

                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

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
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                    >
                      <div className="mb-2 text-2xl">
                        🍛
                      </div>

                      <p className="text-sm font-semibold text-slate-800">
                        Dinner surplus
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
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
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                    >
                      <div className="mb-2 text-2xl">
                        🥐
                      </div>

                      <p className="text-sm font-semibold text-slate-800">
                        Bakery surplus
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
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
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-lime-200 hover:bg-lime-50"
                    >
                      <div className="mb-2 text-2xl">
                        🥬
                      </div>

                      <p className="text-sm font-semibold text-slate-800">
                        Kitchen scraps
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        180 kg · Organic recovery
                      </p>
                    </button>

                  </div>

                </div>

                {/* =================================================
                    SURPLUS FORM
                ================================================= */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  {/* Donor details */}
                  <div>

                    <div className="mb-4 flex items-center gap-2">

                      <Building2 className="h-4 w-4 text-emerald-600" />

                      <h3 className="text-sm font-semibold text-slate-800">
                        Where is the surplus coming from?
                      </h3>

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                      <div>

                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          Establishment name
                        </label>

                        <input
                          type="text"
                          value={donorName}
                          onChange={(e) =>
                            setDonorName(e.target.value)
                          }
                          required
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />

                      </div>

                      <div>

                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          Establishment type
                        </label>

                        <select
                          value={donorType}
                          onChange={(e) =>
                            setDonorType(e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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

                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          Neighborhood
                        </label>

                        <div className="relative">

                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                          <input
                            type="text"
                            value={neighborhood}
                            onChange={(e) =>
                              setNeighborhood(e.target.value)
                            }
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Food details */}
                  <div>

                    <div className="mb-4 flex items-center gap-2">

                      <Utensils className="h-4 w-4 text-emerald-600" />

                      <h3 className="text-sm font-semibold text-slate-800">
                        Tell us about the food
                      </h3>

                    </div>

                    <div className="space-y-4">

                      <div>

                        <label className="mb-2 block text-xs font-medium text-slate-500">
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
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        />

                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div>

                          <label className="mb-2 block text-xs font-medium text-slate-500">
                            Food category
                          </label>

                          <select
                            value={category}
                            onChange={(e) =>
                              setCategory(
                                e.target.value as FoodCategory
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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

                          <label className="mb-2 block text-xs font-medium text-slate-500">
                            Quantity (kg)
                          </label>

                          <input
                            type="number"
                            value={quantityKg}
                            onChange={(e) => {
                              const kg =
                                Number(e.target.value);

                              setQuantityKg(kg);

                              setPortions(
                                Math.round(kg * 2.8)
                              );
                            }}
                            min="1"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />

                        </div>

                        <div>

                          <label className="mb-2 block text-xs font-medium text-slate-500">
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
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Handling */}
                  <div>

                    <div className="mb-4 flex items-center gap-2">

                      <Clock3 className="h-4 w-4 text-emerald-600" />

                      <h3 className="text-sm font-semibold text-slate-800">
                        Handling & recovery
                      </h3>

                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                      <div>

                        <label className="mb-2 block text-xs font-medium text-slate-500">
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
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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

                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          Preferred recovery destination
                        </label>

                        <select
                          value={targetDestinationType}
                          onChange={(e) =>
                            setTargetDestinationType(
                              e.target.value as RecoveryDestinationType
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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
                  <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4">

                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                    <div>

                      <p className="text-sm font-semibold text-amber-900">
                        Food handling note
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-800/80">
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
                      isSubmitting ||
                      !foodName.trim()
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >

                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                        Logging surplus...
                      </>
                    ) : (
                      <>
                        Log surplus & find recovery

                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}

                  </button>

                </form>

              </div>

            </div>

          </div>

          {/* ===================================================
              RIGHT COLUMN
          =================================================== */}
          <div className="space-y-6 xl:col-span-4">

            {/* Impact */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Leaf className="h-5 w-5 text-emerald-600" />
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

                  <p className="mt-1 text-2xl font-bold text-emerald-800">
                    {quantityKg.toLocaleString()} kg
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Portions
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-800">
                      {portions.toLocaleString()}
                    </p>

                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Estimated CH₄
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-800">
                      {(quantityKg * 1.8).toFixed(1)}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      kg planning estimate
                    </p>

                  </div>

                </div>

                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">

                  <p className="text-xs text-sky-700">
                    Estimated water footprint represented
                  </p>

                  <p className="mt-1 text-xl font-bold text-sky-800">
                    {(quantityKg * 100).toLocaleString()} L
                  </p>

                </div>

              </div>

              <p className="mt-4 text-[11px] leading-5 text-slate-400">
                These are planning estimates shown to help understand
                potential environmental impact. They are not measured
                outcomes.
              </p>

            </div>

            {/* Recent surplus */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <FileText className="h-4 w-4 text-emerald-600" />

                  <h3 className="font-bold text-slate-900">
                    Recent surplus
                  </h3>

                </div>

                <span className="text-xs text-slate-400">
                  Today
                </span>

              </div>

              <div className="space-y-3">

                {surplusList
                  .slice(0, 3)
                  .map((item) => (
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

                      <p className="mt-2 truncate text-sm font-medium text-slate-800">
                        {item.foodName}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">

                        <MapPin className="h-3 w-3" />

                        {item.location.neighborhood}

                      </div>

                    </div>
                  ))}

              </div>

            </div>

            {/* Principle */}
            <div className="rounded-3xl bg-emerald-900 p-6 text-white">

              <HeartHandshake className="mb-4 h-7 w-7 text-emerald-300" />

              <h3 className="text-lg font-bold">
                People first.
              </h3>

              <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                When surplus is suitable for people, the system
                prioritizes verified community recovery before
                circular disposal pathways.
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-emerald-200">

                <span>
                  People first
                </span>

                <span>•</span>

                <span>
                  Circular recovery
                </span>

                <span>•</span>

                <span>
                  Landfill last
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =======================================================
          SUCCESS MODAL
      ======================================================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-2xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">

              <CheckCircle2 className="h-8 w-8 text-emerald-600" />

            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Surplus logged successfully
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your surplus has been added to the current rescue
              workflow. Matching and routing can now use the details
              you provided.
            </p>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-left">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">

                  <PackageCheck className="h-4 w-4 text-emerald-600" />

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
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >

              Log another surplus

              <ArrowRight className="h-4 w-4" />

            </button>

          </div>

        </div>
      )}

    </div>
  );
};