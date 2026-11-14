/**
 * Shapes returned by the RasoiGrid backend (snake_case, as sent).
 * The UI's own types live in ../types/models.ts; mappers.ts converts.
 */

export type DonationStatus =
  | "AVAILABLE"
  | "CLAIMED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface DonationDTO {
  id: number;
  donor_id: number;
  donor_name: string | null;
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
  status: DonationStatus | string;
  created_at: string | null;
}

export interface DonationInput {
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
}

export interface NGODTO {
  id: number;
  user_id: number;
  organization_name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  verification_status: "PENDING" | "VERIFIED" | string;
}

export interface NGOInput {
  organization_name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
}

export interface VolunteerDTO {
  id: number;
  user_id: number;
  vehicle_type: string | null;
  latitude: number | null;
  longitude: number | null;
  availability_status: "AVAILABLE" | "UNAVAILABLE" | string;
  name: string | null;
  phone: string | null;
}

export interface VolunteerInput {
  vehicle_type: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface RescueRequestDTO {
  id: number;
  donation_id: number;
  ngo_id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | string;
  donation: DonationDTO | null;
}

export type DispatchStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED";

export interface DispatchDTO {
  id: number;
  rescue_request_id: number;
  volunteer_id: number | null;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  status: DispatchStatus | string;
  donation: DonationDTO | null;
  volunteer_name: string | null;
  volunteer_phone: string | null;
  ngo_name: string | null;
  ngo_address: string | null;
}

export interface ImpactDTO {
  rescued_food_kg: number;
  estimated_meals_supported: number;
  organic_recovery_kg: number;
  total_recovered_kg: number;
  successful_rescues: number;
  total_donations: number;
  rescue_rate_percent: number;
}
