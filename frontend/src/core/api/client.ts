import type {
  FoodSurplusItem,
  RescueMission,
  ForecastPrediction,
  ImpactMetrics,
  ReceiverHub,
  CircularFacility,
} from "../types/models";
import {
  INITIAL_IMPACT_METRICS,
  MOCK_SURPLUS_ITEMS,
  MOCK_RESCUE_MISSIONS,
  MOCK_FORECAST_PREDICTIONS,
  MOCK_RECEIVER_HUBS,
  MOCK_CIRCULAR_FACILITIES,
} from "../mocks/mockData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Simulated latency helper for realistic UX loading states
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.detail || `API request failed: ${response.status}`,
      );
    }

    return response.json();
  }
  private surplusList: FoodSurplusItem[] = [...MOCK_SURPLUS_ITEMS];
  private missionsList: RescueMission[] = [...MOCK_RESCUE_MISSIONS];
  private impactMetrics: ImpactMetrics = { ...INITIAL_IMPACT_METRICS };

  // Surplus & Food Donations
  async getSurplusItems(): Promise<FoodSurplusItem[]> {
    await delay(250);
    return [...this.surplusList];
  }

  async logSurplusItem(
    payload: Omit<
      FoodSurplusItem,
      "id" | "status" | "methaneAvoidedKg" | "waterSavedLiters"
    >,
  ): Promise<FoodSurplusItem> {
    const response = await this.request<{
      id: number;
      donor_id: number;
      food_name: string;
      food_category: string;
      quantity: number;
      unit: string;
      prepared_at: string;
      consume_before: string;
      storage_condition: string | null;
      packaging_available: boolean;
      pickup_required: boolean;
      latitude: number | null;
      longitude: number | null;
      status: string;
    }>("/api/donations/", {
      method: "POST",
      body: JSON.stringify({
        food_name: payload.foodName,
        food_category: payload.category,
        quantity: payload.quantityKg,
        unit: "kg",
        prepared_at: payload.cookedAt,
        consume_before: payload.safeUntil,
        storage_condition: payload.tempRequirement,
        packaging_available: true,
        pickup_required: true,
        latitude: payload.location.lat,
        longitude: payload.location.lng,
      }),
    });

    const newItem: FoodSurplusItem = {
      ...payload,
      id: `SUR-${response.id}`,
      status: response.status.toLowerCase() as FoodSurplusItem["status"],
      methaneAvoidedKg: 0,
      waterSavedLiters: 0,
    };

    this.surplusList.unshift(newItem);

    return newItem;
  }

  // Live Rescue Missions
  async getRescueMissions(): Promise<RescueMission[]> {
    await delay(200);
    return [...this.missionsList];
  }

  async dispatchMission(
    surplusId: string,
    vehicleType: RescueMission["vehicleType"] = "electric_van",
  ): Promise<RescueMission> {
    await delay(350);
    const surplus = this.surplusList.find((s) => s.id === surplusId);
    if (!surplus) throw new Error("Surplus item not found");

    surplus.status = "dispatching";
    surplus.assignedVehicleId = `FLEET-EV-${Math.floor(10 + Math.random() * 90)}`;

    const newMission: RescueMission = {
      id: `MSN-${Math.floor(8000 + Math.random() * 2000)}`,
      code: `RG-${surplus.location.neighborhood.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      surplusItem: surplus,
      pickupTime:
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }) + " IST",
      etaMinutes: Math.floor(8 + Math.random() * 18),
      distanceKm: Number((2.0 + Math.random() * 6.5).toFixed(1)),
      driverName: "Sameer Qureshi (Assigned via AI)",
      driverPhone: "+91 98205 91823",
      vehiclePlate: "MH-02-EV-9411",
      vehicleType,
      receiverName: "Asha Deep Community Shelter",
      receiverLocation: {
        lat: 19.062,
        lng: 72.855,
        address: "Kurla West Junction",
        neighborhood: "Kurla",
        city: "Mumbai",
      },
      currentTempCelsius:
        surplus.tempRequirement === "hot_above_60c"
          ? 65.4
          : surplus.tempRequirement === "chilled_below_4c"
            ? 3.2
            : 24.0,
      otpCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      status: "in_transit",
    };

    this.missionsList.unshift(newMission);
    return newMission;
  }

  async verifyDelivery(missionId: string, _otp: string): Promise<boolean> {
    await delay(300);
    const mission = this.missionsList.find((m) => m.id === missionId);
    if (mission) {
      mission.status = "delivered_human";
      if (mission.surplusItem) {
        mission.surplusItem.status = "delivered_human";
      }
      return true;
    }
    return false;
  }

  // AI Forecasting
  async getForecastPredictions(): Promise<ForecastPrediction[]> {
    await delay(300);
    return [...MOCK_FORECAST_PREDICTIONS];
  }

  // Receivers & Circular Hubs
  async getReceiverHubs(): Promise<ReceiverHub[]> {
    await delay(200);
    return [...MOCK_RECEIVER_HUBS];
  }

  async getCircularFacilities(): Promise<CircularFacility[]> {
    await delay(200);
    return [...MOCK_CIRCULAR_FACILITIES];
  }

  // Impact Telemetry
  async getImpactMetrics(): Promise<ImpactMetrics> {
    await delay(150);
    return { ...this.impactMetrics };
  }
}

export const api = new ApiService();
