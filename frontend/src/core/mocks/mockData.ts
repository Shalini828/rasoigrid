/**
 * Sample data for pages that have no backend yet
 * (forecasts, receiver hubs, circular facilities).
 * Donations, dispatches and impact come from the API.
 */
import type {
  ForecastPrediction,
  ReceiverHub,
  CircularFacility
} from '../types/models';

export const MOCK_FORECAST_PREDICTIONS: ForecastPrediction[] = [
  {
    id: 'FCST-01',
    zone: 'Bandra-Kurla Complex (FinTech Corridor)',
    timeWindow: 'Today 18:30 – 21:00 IST',
    predictedSurplusKg: 280,
    historicalVariancePercent: -4.2,
    confidencePercent: 96.4,
    expectedCategory: 'cooked_meals',
    primaryDonorCategory: 'Corporate Cafeterias & Luxury Hotels',
    weatherFactor: 'Clear skies (31°C) — High footfall at dinner buffets',
    demandMismatchRatio: 0.65, // Deficit in nearby Kurla/Sion
    recommendedPreRouting: 'Pre-position 3 Electric Vans at Diamond District hub',
  },
  {
    id: 'FCST-02',
    zone: 'Andheri East & MIDC Tech Hub',
    timeWindow: 'Today 21:00 – 23:30 IST',
    predictedSurplusKg: 340,
    historicalVariancePercent: +8.1,
    confidencePercent: 93.8,
    expectedCategory: 'cooked_meals',
    primaryDonorCategory: 'Banquets & Event Grounds',
    weatherFactor: 'High evening wedding bookings detected via city calendar',
    demandMismatchRatio: 0.82,
    recommendedPreRouting: 'Direct dispatch to Jogeshwari & Malad North shelters',
  },
  {
    id: 'FCST-03',
    zone: 'Lower Parel Mill District',
    timeWindow: 'Tomorrow 08:00 – 11:00 IST',
    predictedSurplusKg: 110,
    historicalVariancePercent: +1.5,
    confidencePercent: 91.2,
    expectedCategory: 'bakery_grains',
    primaryDonorCategory: 'High-end Bakeries & Cafes',
    weatherFactor: 'Normal morning cycle',
    demandMismatchRatio: 1.20,
    recommendedPreRouting: 'Consolidate with Dharavi youth breakfast program',
  },
  {
    id: 'FCST-04',
    zone: 'Vashi Wholesale Market & Cold Storage',
    timeWindow: 'Continuous 24h Cycle',
    predictedSurplusKg: 850,
    historicalVariancePercent: +12.0,
    confidencePercent: 98.2,
    expectedCategory: 'non_edible_organic',
    primaryDonorCategory: 'Agricultural Produce Mandi',
    weatherFactor: 'Humid storage conditions accelerating peel degradation',
    demandMismatchRatio: 2.80,
    recommendedPreRouting: 'Direct heavy route to Mahape Biomethanation Grid',
  }
];

export const MOCK_RECEIVER_HUBS: ReceiverHub[] = [
  {
    id: 'RCV-01',
    name: 'Asha Deep Community Shelter',
    type: 'shelter',
    location: {
      lat: 19.0620,
      lng: 72.8550,
      address: 'Kurla West Junction',
      neighborhood: 'Kurla',
      city: 'Mumbai',
    },
    dailyCapacityMeals: 450,
    currentIntakeMeals: 290,
    urgencyLevel: 'urgent_shortage',
    acceptedDietary: ['vegetarian', 'halal', 'jain'],
    contactPerson: 'Sister Mary / Rajesh K.',
    contactPhone: '+91 98200 11223',
  },
  {
    id: 'RCV-02',
    name: 'Dharavi Children & Elders Food Bank',
    type: 'community_kitchen',
    location: {
      lat: 19.0400,
      lng: 72.8570,
      address: '90 Feet Road, Dharavi',
      neighborhood: 'Dharavi',
      city: 'Mumbai',
    },
    dailyCapacityMeals: 800,
    currentIntakeMeals: 410,
    urgencyLevel: 'urgent_shortage',
    acceptedDietary: ['vegetarian', 'halal'],
    contactPerson: 'Imran Ansari',
    contactPhone: '+91 98921 55644',
  },
  {
    id: 'RCV-03',
    name: 'Sanjeevani Annakshetra Kitchen',
    type: 'community_kitchen',
    location: {
      lat: 19.1250,
      lng: 72.8450,
      address: 'Jogeshwari West Link Rd',
      neighborhood: 'Jogeshwari',
      city: 'Mumbai',
    },
    dailyCapacityMeals: 600,
    currentIntakeMeals: 580,
    urgencyLevel: 'capacity_reached',
    acceptedDietary: ['vegetarian', 'jain'],
    contactPerson: 'Pandit Sharma',
    contactPhone: '+91 98334 99012',
  },
  {
    id: 'RCV-04',
    name: 'Karuna Animal Rescue & Goshala Sanctuary',
    type: 'animal_sanctuary',
    location: {
      lat: 19.1900,
      lng: 72.8600,
      address: 'Aarey Forest Buffer Zone',
      neighborhood: 'Goregaon East',
      city: 'Mumbai',
    },
    dailyCapacityMeals: 1200,
    currentIntakeMeals: 650,
    urgencyLevel: 'normal',
    acceptedDietary: ['bakery_grains', 'fresh_produce_scraps'],
    contactPerson: 'Dr. Anita Roy',
    contactPhone: '+91 98199 44332',
  }
];

export const MOCK_CIRCULAR_FACILITIES: CircularFacility[] = [
  {
    id: 'CIRC-01',
    name: 'Mahape Waste-to-Biogas Cogeneration Plant',
    type: 'biogas_cogeneration',
    location: {
      lat: 19.1120,
      lng: 73.0180,
      address: 'MIDC Industrial Area, Mahape',
      neighborhood: 'Navi Mumbai',
      city: 'Mumbai',
    },
    dailyCapacityKg: 5000,
    currentTonnageKg: 3420,
    methaneConversionEfficiency: 96.8,
    energyGeneratedKwh: 4850,
  },
  {
    id: 'CIRC-02',
    name: 'Kanjurmarg Black Soldier Fly Protein Farm',
    type: 'black_soldier_fly',
    location: {
      lat: 19.1350,
      lng: 72.9350,
      address: 'Kanjurmarg East Bio-Park',
      neighborhood: 'Kanjurmarg',
      city: 'Mumbai',
    },
    dailyCapacityKg: 2000,
    currentTonnageKg: 1680,
    methaneConversionEfficiency: 98.4,
    energyGeneratedKwh: 1200,
  },
  {
    id: 'CIRC-03',
    name: 'Bandra Urban Community Aerobic Digester',
    type: 'aerobic_composting',
    location: {
      lat: 19.0550,
      lng: 72.8350,
      address: 'Carter Road Eco Park',
      neighborhood: 'Bandra West',
      city: 'Mumbai',
    },
    dailyCapacityKg: 800,
    currentTonnageKg: 620,
    methaneConversionEfficiency: 94.2,
    energyGeneratedKwh: 340,
  }
];
