import { useAuthStore } from "../../stores/useAuthStore";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Turn FastAPI's error body into one readable sentence. */
const readDetail = (body: unknown, status: number): string => {
  const detail = (body as { detail?: unknown } | null)?.detail;

  if (typeof detail === "string") return detail;

  // Validation errors come back as a list of { loc, msg }.
  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map((d: { loc?: unknown[]; msg?: string }) => {
        const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : "";
        return field ? `${field}: ${d.msg}` : d.msg;
      })
      .join("; ");
  }

  return `Request failed (${status})`;
};

/**
 * Call the RasoiGrid API with the logged-in user's token.
 *
 * A 401 means the token is missing or expired: the user is logged
 * out and sent to the login page.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = useAuthStore.getState().token;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401 && token) {
    useAuthStore.getState().logout();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(readDetail(body, response.status), response.status);
  }

  return body as T;
}
