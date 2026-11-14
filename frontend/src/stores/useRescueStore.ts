import { create } from 'zustand';
import type { FoodSurplusItem, RescueMission, ImpactMetrics } from '../core/types/models';
import type { NGODTO, VolunteerDTO, DispatchStatus } from '../core/api/types';
import { api, type NewDonation } from '../core/api/client';
import { toSurplusItem } from '../core/api/mappers';
import { useAuthStore } from './useAuthStore';

interface RescueStoreState {
  /** Donor: own donations. NGO: available + claimed donations. */
  surplusList: FoodSurplusItem[];
  /** NGO: its dispatches. Volunteer: dispatches assigned to them. */
  missionsList: RescueMission[];
  impactMetrics: ImpactMetrics | null;
  ngoProfile: NGODTO | null;
  volunteerProfile: VolunteerDTO | null;
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  selectedCategory: string;
  selectedUrgency: string;
  liveSimulationActive: boolean;

  fetchInitialData: () => Promise<void>;
  logSurplus: (item: NewDonation) => Promise<FoodSurplusItem>;
  cancelSurplus: (surplusId: string) => Promise<void>;
  /** NGO: claim a donation and dispatch the nearest available volunteer. */
  dispatchMission: (surplusId: string) => Promise<RescueMission>;
  /** Move a dispatch to its next status (NGO or assigned volunteer). */
  updateMissionStatus: (
    missionId: string,
    status: DispatchStatus,
    code?: string,
  ) => Promise<RescueMission>;
  setNgoProfile: (ngo: NGODTO) => void;
  setVolunteerProfile: (v: VolunteerDTO) => void;
  reset: () => void;
  setSelectedCategory: (cat: string) => void;
  setSelectedUrgency: (urg: string) => void;
  toggleSimulation: () => void;
}

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Something went wrong';

const initialData = {
  surplusList: [],
  missionsList: [],
  impactMetrics: null,
  ngoProfile: null,
  volunteerProfile: null,
  isLoading: false,
  hasLoaded: false,
  error: null,
};

export const useRescueStore = create<RescueStoreState>((set, get) => ({
  ...initialData,
  selectedCategory: 'all',
  selectedUrgency: 'all',
  liveSimulationActive: true,

  fetchInitialData: async () => {
    const role = useAuthStore.getState().user?.role;
    if (!role) return;

    set({ isLoading: true, error: null });

    try {
      const impact = await api.getMyImpact().catch(() => null);

      if (role === 'DONOR') {
        const surplusList = await api.getMyDonations();
        set({ surplusList, missionsList: [], impactMetrics: impact });
      } else if (role === 'NGO') {
        const ngoProfile = await api.getMyNgo();
        let surplusList: FoodSurplusItem[] = [];
        let missionsList: RescueMission[] = [];

        if (ngoProfile) {
          const [available, requests, missions] = await Promise.all([
            api.getAvailableDonations(),
            api.getMyRescueRequests(),
            api.getNgoDispatches(),
          ]);
          // Claimed donations no longer appear in the available list,
          // so add them back from this NGO's accepted requests.
          const claimed = requests
            .filter((r) => r.status === 'ACCEPTED' && r.donation)
            .map((r) => toSurplusItem(r.donation!));
          const seen = new Set(available.map((d) => d.id));
          surplusList = [...available, ...claimed.filter((d) => !seen.has(d.id))];
          missionsList = missions;
        }

        set({ ngoProfile, surplusList, missionsList, impactMetrics: impact });
      } else if (role === 'VOLUNTEER') {
        const volunteerProfile = await api.getMyVolunteer();
        const missionsList = volunteerProfile ? await api.getAssignedDispatches() : [];
        set({ volunteerProfile, surplusList: [], missionsList, impactMetrics: impact });
      } else {
        set({ surplusList: [], missionsList: [], impactMetrics: impact });
      }
    } catch (err) {
      set({ error: errorMessage(err) });
    } finally {
      set({ isLoading: false, hasLoaded: true });
    }
  },

  logSurplus: async (item) => {
    const newItem = await api.createDonation(item);
    set((state) => ({ surplusList: [newItem, ...state.surplusList] }));
    return newItem;
  },

  cancelSurplus: async (surplusId) => {
    const updated = await api.cancelDonation(Number(surplusId));
    set((state) => ({
      surplusList: state.surplusList.map((s) => (s.id === surplusId ? updated : s)),
    }));
  },

  dispatchMission: async (surplusId) => {
    const { ngoProfile, surplusList } = get();
    if (!ngoProfile) {
      throw new Error('Set up your NGO profile first.');
    }
    if (ngoProfile.verification_status !== 'VERIFIED') {
      throw new Error('Your NGO must be verified by an admin before claiming food.');
    }

    const surplus = surplusList.find((s) => s.id === surplusId);
    if (!surplus) throw new Error('Donation not found');

    const request = await api.claimDonation(surplus.backendId, ngoProfile.id);

    // Nearest available volunteer, if any; otherwise the dispatch waits.
    const volunteers = await api.getAvailableVolunteers(surplus.backendId);

    const delivery =
      ngoProfile.latitude !== null && ngoProfile.longitude !== null
        ? { lat: ngoProfile.latitude, lng: ngoProfile.longitude }
        : null;

    const mission = await api.createDispatch({
      rescueRequestId: request.id,
      volunteerId: volunteers[0]?.id ?? null,
      pickup: surplus.location ? { lat: surplus.location.lat, lng: surplus.location.lng } : null,
      delivery,
    });

    set((state) => ({
      surplusList: state.surplusList.map((s) =>
        s.id === surplusId && mission.surplusItem ? mission.surplusItem : s,
      ),
      missionsList: [mission, ...state.missionsList],
    }));

    return mission;
  },

  updateMissionStatus: async (missionId, status, code) => {
    const mission = await api.updateDispatchStatus(Number(missionId), status, code);
    set((state) => ({
      missionsList: state.missionsList.map((m) => (m.id === missionId ? mission : m)),
      surplusList: state.surplusList.map((s) =>
        mission.surplusItem && s.id === mission.surplusItem.id ? mission.surplusItem : s,
      ),
    }));

    if (status === 'DELIVERED') {
      const impactMetrics = await api.getMyImpact().catch(() => null);
      if (impactMetrics) set({ impactMetrics });
    }

    // The server frees the volunteer when a pickup ends; pick that up.
    if (get().volunteerProfile && (status === 'DELIVERED' || status === 'CANCELLED')) {
      const volunteerProfile = await api.getMyVolunteer().catch(() => null);
      if (volunteerProfile) set({ volunteerProfile });
    }

    return mission;
  },

  setNgoProfile: (ngoProfile) => set({ ngoProfile }),
  setVolunteerProfile: (volunteerProfile) => set({ volunteerProfile }),
  reset: () => set({ ...initialData }),

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedUrgency: (selectedUrgency) => set({ selectedUrgency }),
  toggleSimulation: () => set((state) => ({ liveSimulationActive: !state.liveSimulationActive })),
}));
