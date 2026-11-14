export type FoodCategory = 
  | 'cooked_meals' 
  | 'bakery_grains' 
  | 'fresh_produce' 
  | 'dairy_cold' 
  | 'packaged_dry' 
  | 'non_edible_organic';

export type RescueStatus = 
  | 'predicted' 
  | 'available' 
  | 'dispatching' 
  | 'in_transit' 
  | 'delivered_human' 
  | 'diverted_circular' 
  | 'cancelled';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'standard';

export type RecoveryDestinationType = 
  | 'shelter' 
  | 'community_kitchen' 
  | 'orphanage' 
  | 'animal_sanctuary' 
  | 'biogas_plant' 
  | 'compost_facility';

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
  city: string;
}

export type TempRequirement = 'hot_above_60c' | 'ambient' | 'chilled_below_4c';

/** A donation as the UI shows it. Built from the API in core/api/mappers.ts. */
export interface FoodSurplusItem {
  id: string;
  backendId: number;
  donorName: string;
  foodName: string;
  category: FoodCategory;
  quantityKg: number;
  unit: string;
  /** Estimated at 0.5 kg per meal, the backend's planning figure. */
  portions: number;
  cookedAt: string; // ISO String
  safeUntil: string; // ISO String
  hoursLeft: number;
  tempRequirement: TempRequirement;
  packagingAvailable: boolean;
  location: GeoLocation | null;
  status: RescueStatus;
  backendStatus: string;
  priority: PriorityLevel;
  createdAt: string | null;
}

/** A dispatch (pickup and delivery job) as the UI shows it. */
export interface RescueMission {
  id: string;
  backendId: number;
  code: string;
  surplusItem: FoodSurplusItem | null;
  dispatchStatus: string;
  volunteerId: number | null;
  driverName: string;
  driverPhone: string;
  receiverName: string;
  receiverAddress: string;
  receiverLocation: GeoLocation | null;
  distanceKm: number | null;
  status: RescueStatus;
}

export interface ForecastPrediction {
  id: string;
  zone: string;
  timeWindow: string;
  predictedSurplusKg: number;
  historicalVariancePercent: number;
  confidencePercent: number;
  expectedCategory: FoodCategory;
  primaryDonorCategory: string;
  weatherFactor: string;
  demandMismatchRatio: number; // >1 means surplus > demand, <1 means high hunger deficit
  recommendedPreRouting: string;
}

export interface ImpactMetrics {
  totalMealsRecovered: number;
  totalKgRecovered: number;
  organicRecoveryKg: number;
  successfulRescues: number;
  totalDonations: number;
  rescueRatePercent: number;
}

export interface ReceiverHub {
  id: string;
  name: string;
  type: RecoveryDestinationType;
  location: GeoLocation;
  dailyCapacityMeals: number;
  currentIntakeMeals: number;
  urgencyLevel: 'urgent_shortage' | 'normal' | 'capacity_reached';
  acceptedDietary: string[];
  contactPerson: string;
  contactPhone: string;
}

export interface CircularFacility {
  id: string;
  name: string;
  type: 'biogas_cogeneration' | 'black_soldier_fly' | 'aerobic_composting';
  location: GeoLocation;
  dailyCapacityKg: number;
  currentTonnageKg: number;
  methaneConversionEfficiency: number; // e.g. 96.5%
  energyGeneratedKwh: number;
}
