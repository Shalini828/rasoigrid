import type {
  FoodCategory,
  FoodSurplusItem,
  GeoLocation,
  ImpactMetrics,
  PriorityLevel,
  RescueMission,
  RescueStatus,
  TempRequirement,
} from "../types/models";
import type { DispatchDTO, DonationDTO, ImpactDTO } from "./types";

/* ---------------------------------------------------------------
   Category: UI value <-> backend value.
   Backend names match the recovery service's organic categories.
---------------------------------------------------------------- */

const CATEGORY_TO_API: Record<FoodCategory, string> = {
  cooked_meals: "COOKED MEALS",
  bakery_grains: "BAKERY",
  fresh_produce: "VEGETABLES",
  dairy_cold: "DAIRY",
  packaged_dry: "PACKAGED",
  non_edible_organic: "ORGANIC WASTE",
};

const API_TO_CATEGORY: Record<string, FoodCategory> = {
  "COOKED MEALS": "cooked_meals",
  BAKERY: "bakery_grains",
  GRAINS: "bakery_grains",
  VEGETABLES: "fresh_produce",
  FRUITS: "fresh_produce",
  DAIRY: "dairy_cold",
  PACKAGED: "packaged_dry",
  "ORGANIC WASTE": "non_edible_organic",
  "FOOD SCRAPS": "non_edible_organic",
};

export const categoryToApi = (c: FoodCategory) => CATEGORY_TO_API[c];

const categoryFromApi = (c: string): FoodCategory =>
  API_TO_CATEGORY[c.trim().toUpperCase()] ?? "cooked_meals";

const TEMPS: TempRequirement[] = ["hot_above_60c", "ambient", "chilled_below_4c"];

const tempFromApi = (s: string | null): TempRequirement =>
  TEMPS.includes(s as TempRequirement) ? (s as TempRequirement) : "ambient";

/* ---------------------------------------------------------------
   Statuses
---------------------------------------------------------------- */

const DONATION_STATUS: Record<string, RescueStatus> = {
  AVAILABLE: "available",
  CLAIMED: "dispatching",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered_human",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
};

const DISPATCH_STATUS: Record<string, RescueStatus> = {
  PENDING: "dispatching",
  ASSIGNED: "dispatching",
  PICKED_UP: "in_transit",
  DELIVERED: "delivered_human",
  CANCELLED: "cancelled",
};

/* ---------------------------------------------------------------
   Time helpers
---------------------------------------------------------------- */

/** The backend stores UTC without an offset; read it as UTC. */
export const parseApiDate = (value: string): Date =>
  new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(value) ? value : `${value}Z`);

const API_PRIORITY: Record<string, PriorityLevel> = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "standard",
};

/**
 * Fallback when the backend sends no score (e.g. older data).
 * Same thresholds as backend/app/services/config.py
 * (2 h critical, 6 h high, 12 h medium).
 */
const priorityFromHours = (hours: number): PriorityLevel => {
  if (hours <= 2) return "critical";
  if (hours <= 6) return "high";
  if (hours <= 12) return "medium";
  return "standard";
};

export const KG_PER_MEAL = 0.5;

/* ---------------------------------------------------------------
   Geography
---------------------------------------------------------------- */

const toLocation = (
  lat: number | null,
  lng: number | null,
  address = "",
): GeoLocation | null => {
  if (lat === null || lng === null) return null;
  return {
    lat,
    lng,
    address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    neighborhood: address || `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
    city: "",
  };
};

export const distanceKm = (a: GeoLocation | null, b: GeoLocation | null) => {
  if (!a || !b) return null;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

/* ---------------------------------------------------------------
   Mappers
---------------------------------------------------------------- */

export const toSurplusItem = (d: DonationDTO): FoodSurplusItem => {
  const safeUntil = parseApiDate(d.consume_before);
  const hoursLeft = (safeUntil.getTime() - Date.now()) / 3_600_000;
  const isKg = ["kg", "kgs", "kilogram", "kilograms"].includes(
    d.unit.toLowerCase(),
  );

  return {
    id: String(d.id),
    backendId: d.id,
    donorName: d.donor_name ?? `Donor #${d.donor_id}`,
    foodName: d.food_name,
    category: categoryFromApi(d.food_category),
    quantityKg: d.quantity,
    unit: d.unit,
    portions: isKg ? Math.round(d.quantity / KG_PER_MEAL) : 0,
    cookedAt: parseApiDate(d.prepared_at).toISOString(),
    safeUntil: safeUntil.toISOString(),
    hoursLeft,
    tempRequirement: tempFromApi(d.storage_condition),
    packagingAvailable: d.packaging_available,
    location: toLocation(d.latitude, d.longitude),
    status: DONATION_STATUS[d.status] ?? "available",
    backendStatus: d.status,
    priority:
      (d.priority && API_PRIORITY[d.priority]) || priorityFromHours(hoursLeft),
    priorityScore: d.priority_score ?? null,
    recoveryPath: d.recovery_path ?? null,
    recommendedAction: d.recommended_action ?? null,
    distanceToNgoKm: d.distance_to_ngo_km ?? null,
    safetyChecklist: d.safety_checklist
      ? {
          confirmed:
            d.safety_checklist.hygienic_preparation &&
            d.safety_checklist.safe_temperature &&
            d.safety_checklist.covered_and_labelled &&
            d.safety_checklist.no_spoilage_signs,
          allergens: d.safety_checklist.allergens,
        }
      : null,
    createdAt: d.created_at ? parseApiDate(d.created_at).toISOString() : null,
  };
};

export const toMission = (d: DispatchDTO): RescueMission => {
  const surplusItem = d.donation ? toSurplusItem(d.donation) : null;
  const pickup =
    toLocation(d.pickup_latitude, d.pickup_longitude) ??
    surplusItem?.location ??
    null;
  const receiverLocation = toLocation(
    d.delivery_latitude,
    d.delivery_longitude,
    d.ngo_address ?? "",
  );
  const km = distanceKm(pickup, receiverLocation);

  return {
    id: String(d.id),
    backendId: d.id,
    code: `RG-${String(d.id).padStart(4, "0")}`,
    surplusItem,
    dispatchStatus: d.status,
    volunteerId: d.volunteer_id,
    driverName: d.volunteer_name ?? "Volunteer not assigned",
    driverPhone: d.volunteer_phone ?? "",
    receiverName: d.ngo_name ?? "NGO",
    receiverAddress: d.ngo_address ?? "",
    receiverLocation,
    distanceKm: km === null ? null : Number(km.toFixed(1)),
    status: DISPATCH_STATUS[d.status] ?? "dispatching",
    requiresHandoverCode: d.requires_handover_code ?? false,
    handoverConfirmed: d.handover_confirmed ?? false,
    handoverCode: d.handover_code ?? null,
  };
};

export const toImpactMetrics = (d: ImpactDTO): ImpactMetrics => ({
  totalMealsRecovered: d.estimated_meals_supported,
  totalKgRecovered: d.total_recovered_kg,
  organicRecoveryKg: d.organic_recovery_kg,
  successfulRescues: d.successful_rescues,
  totalDonations: d.total_donations,
  rescueRatePercent: d.rescue_rate_percent,
});
