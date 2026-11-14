import type {
  CircularFacility,
  FoodCategory,
  FoodSurplusItem,
  ForecastPrediction,
  ImpactMetrics,
  ReceiverHub,
  RescueMission,
  TempRequirement,
} from "../types/models";
import {
  MOCK_CIRCULAR_FACILITIES,
  MOCK_FORECAST_PREDICTIONS,
  MOCK_RECEIVER_HUBS,
} from "../mocks/mockData";
import { apiRequest } from "./http";
import {
  categoryToApi,
  toImpactMetrics,
  toMission,
  toSurplusItem,
} from "./mappers";
import type {
  DispatchDTO,
  DispatchStatus,
  DonationDTO,
  DonationInput,
  ImpactDTO,
  NGODTO,
  NGOInput,
  RescueRequestDTO,
  VolunteerDTO,
  VolunteerInput,
} from "./types";

/** What the donor form collects. */
export interface NewDonation {
  foodName: string;
  category: FoodCategory;
  quantityKg: number;
  cookedAt: string; // ISO
  safeUntil: string; // ISO
  tempRequirement: TempRequirement;
  packagingAvailable: boolean;
  latitude: number | null;
  longitude: number | null;
}

const toDonationInput = (d: NewDonation): DonationInput => ({
  food_name: d.foodName.trim(),
  food_category: categoryToApi(d.category),
  quantity: d.quantityKg,
  unit: "kg",
  prepared_at: d.cookedAt,
  consume_before: d.safeUntil,
  storage_condition: d.tempRequirement,
  packaging_available: d.packagingAvailable,
  pickup_required: true,
  latitude: d.latitude,
  longitude: d.longitude,
});

const json = (body: unknown): RequestInit => ({ body: JSON.stringify(body) });

class ApiService {
  /* ---------------- Donations (donor) ---------------- */

  async getMyDonations(): Promise<FoodSurplusItem[]> {
    const rows = await apiRequest<DonationDTO[]>("/api/donations/my");
    return rows.map(toSurplusItem);
  }

  async createDonation(d: NewDonation): Promise<FoodSurplusItem> {
    const row = await apiRequest<DonationDTO>("/api/donations/", {
      method: "POST",
      ...json(toDonationInput(d)),
    });
    return toSurplusItem(row);
  }

  async cancelDonation(id: number): Promise<FoodSurplusItem> {
    const row = await apiRequest<DonationDTO>(`/api/donations/${id}/cancel`, {
      method: "PATCH",
    });
    return toSurplusItem(row);
  }

  /* ---------------- Donations (NGO) ---------------- */

  async getAvailableDonations(): Promise<FoodSurplusItem[]> {
    const rows = await apiRequest<DonationDTO[]>("/api/donations/");
    return rows.map(toSurplusItem);
  }

  async getMyRescueRequests(): Promise<RescueRequestDTO[]> {
    return apiRequest<RescueRequestDTO[]>("/api/rescue-requests/my");
  }

  /**
   * Claim a donation for the logged-in NGO: create a rescue request
   * and accept it. Returns the accepted request.
   */
  async claimDonation(donationId: number, ngoId: number): Promise<RescueRequestDTO> {
    const existing = (await this.getMyRescueRequests()).find(
      (r) => r.donation_id === donationId,
    );

    const request =
      existing ??
      (await apiRequest<RescueRequestDTO>("/api/rescue-requests/", {
        method: "POST",
        ...json({ donation_id: donationId, ngo_id: ngoId }),
      }));

    if (request.status === "ACCEPTED") return request;

    return apiRequest<RescueRequestDTO>(
      `/api/rescue-requests/${request.id}/status?status=ACCEPTED`,
      { method: "PATCH" },
    );
  }

  /* ---------------- NGO profile ---------------- */

  async getMyNgo(): Promise<NGODTO | null> {
    try {
      return await apiRequest<NGODTO>("/api/ngos/my");
    } catch (err) {
      if ((err as { status?: number }).status === 404) return null;
      throw err;
    }
  }

  async createNgo(input: NGOInput): Promise<NGODTO> {
    return apiRequest<NGODTO>("/api/ngos/", { method: "POST", ...json(input) });
  }

  /* ---------------- Admin ---------------- */

  async getAllNgos(): Promise<NGODTO[]> {
    return apiRequest<NGODTO[]>("/api/ngos/all");
  }

  async verifyNgo(id: number): Promise<NGODTO> {
    return apiRequest<NGODTO>(`/api/ngos/${id}/verify`, { method: "PATCH" });
  }

  /* ---------------- Volunteers ---------------- */

  async getAvailableVolunteers(donationId?: number): Promise<VolunteerDTO[]> {
    const query = donationId ? `?donation_id=${donationId}` : "";
    return apiRequest<VolunteerDTO[]>(`/api/volunteers/available${query}`);
  }

  async getMyVolunteer(): Promise<VolunteerDTO | null> {
    try {
      return await apiRequest<VolunteerDTO>("/api/volunteers/my");
    } catch (err) {
      if ((err as { status?: number }).status === 404) return null;
      throw err;
    }
  }

  async createVolunteer(input: VolunteerInput): Promise<VolunteerDTO> {
    return apiRequest<VolunteerDTO>("/api/volunteers/", {
      method: "POST",
      ...json(input),
    });
  }

  /** The backend flips AVAILABLE <-> UNAVAILABLE. */
  async toggleAvailability(): Promise<VolunteerDTO> {
    return apiRequest<VolunteerDTO>("/api/volunteers/my/availability", {
      method: "PATCH",
    });
  }

  /* ---------------- Dispatches ---------------- */

  async getNgoDispatches(): Promise<RescueMission[]> {
    const rows = await apiRequest<DispatchDTO[]>("/api/dispatches/my");
    return rows.map(toMission);
  }

  async getAssignedDispatches(): Promise<RescueMission[]> {
    const rows = await apiRequest<DispatchDTO[]>("/api/dispatches/assigned");
    return rows.map(toMission);
  }

  async createDispatch(input: {
    rescueRequestId: number;
    volunteerId: number | null;
    pickup: { lat: number; lng: number } | null;
    delivery: { lat: number; lng: number } | null;
  }): Promise<RescueMission> {
    const row = await apiRequest<DispatchDTO>("/api/dispatches/", {
      method: "POST",
      ...json({
        rescue_request_id: input.rescueRequestId,
        volunteer_id: input.volunteerId,
        pickup_latitude: input.pickup?.lat ?? null,
        pickup_longitude: input.pickup?.lng ?? null,
        delivery_latitude: input.delivery?.lat ?? null,
        delivery_longitude: input.delivery?.lng ?? null,
      }),
    });
    return toMission(row);
  }

  async updateDispatchStatus(id: number, status: DispatchStatus): Promise<RescueMission> {
    const row = await apiRequest<DispatchDTO>(
      `/api/dispatches/${id}/status?status=${status}`,
      { method: "PATCH" },
    );
    return toMission(row);
  }

  /* ---------------- Impact ---------------- */

  async getImpactMetrics(): Promise<ImpactMetrics> {
    return toImpactMetrics(await apiRequest<ImpactDTO>("/api/impact/"));
  }

  /* -----------------------------------------------------------
     Sample data: these pages have no backend endpoints yet.
  ------------------------------------------------------------ */

  async getForecastPredictions(): Promise<ForecastPrediction[]> {
    return [...MOCK_FORECAST_PREDICTIONS];
  }

  async getReceiverHubs(): Promise<ReceiverHub[]> {
    return [...MOCK_RECEIVER_HUBS];
  }

  async getCircularFacilities(): Promise<CircularFacility[]> {
    return [...MOCK_CIRCULAR_FACILITIES];
  }
}

export const api = new ApiService();
