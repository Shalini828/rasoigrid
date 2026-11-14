import React, { useState } from "react";
import { Building2, Clock3, MapPin, Truck } from "lucide-react";

import { api } from "../../core/api/client";
import { useRescueStore } from "../../stores/useRescueStore";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100";

/** Latitude/longitude inputs with a "use my location" button. */
const LocationFields: React.FC<{
  latitude: string;
  longitude: string;
  onChange: (lat: string, lng: string) => void;
  onError: (message: string) => void;
}> = ({ latitude, longitude, onChange, onError }) => {
  const [isLocating, setIsLocating] = useState(false);

  const locate = () => {
    if (!navigator.geolocation) {
      onError("This browser cannot share your location. Enter it by hand.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude.toFixed(5), pos.coords.longitude.toFixed(5));
        setIsLocating(false);
      },
      () => {
        onError("Could not read your location. Enter it by hand.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex items-end">
        <button
          type="button"
          onClick={locate}
          disabled={isLocating}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
        >
          <MapPin className="h-4 w-4" />
          {isLocating ? "Finding you…" : "Use my location"}
        </button>
      </div>
      <label className="block">
        <span className="mb-2 block text-xs font-medium text-slate-500">Latitude</span>
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => onChange(e.target.value, longitude)}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-medium text-slate-500">Longitude</span>
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => onChange(latitude, e.target.value)}
          className={inputClass}
        />
      </label>
    </div>
  );
};

const toCoord = (v: string) => {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

/* ------------------------------------------------------------------ */

/** Shown to an NGO user who has no NGO profile yet. */
export const NgoProfileSetup: React.FC = () => {
  const setNgoProfile = useRescueStore((s) => s.setNgoProfile);
  const fetchInitialData = useRescueStore((s) => s.fetchInitialData);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const ngo = await api.createNgo({
        organization_name: name.trim(),
        address: address.trim(),
        capacity: Number(capacity),
        latitude: toCoord(latitude),
        longitude: toCoord(longitude),
      });
      setNgoProfile(ngo);
      await fetchInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Set up your NGO profile</h2>
          <p className="mt-1 text-xs text-slate-500">
            An admin verifies your NGO before you can claim donations.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-xs font-medium text-slate-500">Organization name</span>
            <input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-slate-500">Daily capacity (kg)</span>
            <input
              required
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className={inputClass}
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-2 block text-xs font-medium text-slate-500">Address</span>
          <input required minLength={5} value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
        </label>
        <LocationFields
          latitude={latitude}
          longitude={longitude}
          onChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          onError={setError}
        />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
        >
          {saving ? "Saving…" : "Save NGO profile"}
        </button>
      </form>
    </section>
  );
};

/** Shown to an NGO whose profile is waiting for admin verification. */
export const NgoPendingBanner: React.FC = () => (
  <section className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
    <div>
      <p className="text-sm font-semibold text-amber-900">Waiting for verification</p>
      <p className="mt-1 text-xs leading-5 text-amber-800/80">
        An admin needs to verify your NGO before you can see and claim donations.
      </p>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */

/** Shown to a volunteer user who has no volunteer profile yet. */
export const VolunteerProfileSetup: React.FC = () => {
  const setVolunteerProfile = useRescueStore((s) => s.setVolunteerProfile);
  const fetchInitialData = useRescueStore((s) => s.fetchInitialData);

  const [vehicle, setVehicle] = useState("scooter");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const volunteer = await api.createVolunteer({
        vehicle_type: vehicle,
        latitude: toCoord(latitude),
        longitude: toCoord(longitude),
      });
      setVolunteerProfile(volunteer);
      await fetchInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mb-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Set up your volunteer profile</h2>
          <p className="mt-1 text-xs text-slate-500">
            NGOs assign pickups to the nearest available volunteer.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <label className="block md:w-1/3">
          <span className="mb-2 block text-xs font-medium text-slate-500">Vehicle</span>
          <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputClass}>
            <option value="bicycle">Bicycle</option>
            <option value="scooter">Scooter / motorbike</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
          </select>
        </label>
        <LocationFields
          latitude={latitude}
          longitude={longitude}
          onChange={(lat, lng) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
          onError={setError}
        />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
        >
          {saving ? "Saving…" : "Save volunteer profile"}
        </button>
      </form>
    </section>
  );
};
