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

export interface FoodSurplusItem {
  id: string;
  donorName: string;
  donorType: 'hotel_buffet' | 'corporate_cafeteria' | 'restaurant' | 'supermarket' | 'event_caterer';
  foodName: string;
  category: FoodCategory;
  quantityKg: number;
  portions: number;
  cookedAt: string; // ISO String
  safeUntil: string; // ISO String
  tempRequirement: 'hot_above_60c' | 'ambient' | 'chilled_below_4c';
  dietaryTags: ('vegetarian' | 'vegan' | 'halal' | 'jain' | 'contains_nuts' | 'dairy_free')[];
  location: GeoLocation;
  status: RescueStatus;
  priority: PriorityLevel;
  confidenceScore?: number; // AI forecast confidence (0-100)
  targetDestinationType: RecoveryDestinationType;
  assignedVehicleId?: string;
  methaneAvoidedKg: number;
  waterSavedLiters: number;
}

export interface RescueMission {
  id: string;
  code: string;
  surplusItem: FoodSurplusItem;
  pickupTime: string;
  etaMinutes: number;
  distanceKm: number;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  vehicleType: 'electric_van' | 'insulated_scooter' | 'refrigerated_truck';
  receiverName: string;
  receiverLocation: GeoLocation;
  currentTempCelsius: number;
  otpCode: string;
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
  co2eAvoidedTons: number;
  methaneAvoidedKg: number;
  waterSavedMegaLiters: number;
  activeFleetCount: number;
  activeKitchenPartners: number;
  communityBeneficiaries: number;
  circularDiversionRatePercent: number; // percentage directed to human + circular vs landfill
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
