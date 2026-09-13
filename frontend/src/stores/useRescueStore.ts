import { create } from 'zustand';
import type { FoodSurplusItem, RescueMission, ImpactMetrics } from '../core/types/models';
import { api } from '../core/api/client';

interface RescueStoreState {
  surplusList: FoodSurplusItem[];
  missionsList: RescueMission[];
  impactMetrics: ImpactMetrics | null;
  isLoading: boolean;
  selectedCategory: string;
  selectedUrgency: string;
  liveSimulationActive: boolean;
  
  // Actions
  fetchInitialData: () => Promise<void>;
  logSurplus: (item: Parameters<typeof api.logSurplusItem>[0]) => Promise<FoodSurplusItem>;
  dispatchMission: (surplusId: string, vehicleType?: RescueMission['vehicleType']) => Promise<RescueMission>;
  verifyMissionDelivery: (missionId: string, otp: string) => Promise<boolean>;
  setSelectedCategory: (cat: string) => void;
  setSelectedUrgency: (urg: string) => void;
  toggleSimulation: () => void;
}

export const useRescueStore = create<RescueStoreState>((set) => ({
  surplusList: [],
  missionsList: [],
  impactMetrics: null,
  isLoading: false,
  selectedCategory: 'all',
  selectedUrgency: 'all',
  liveSimulationActive: true,

  fetchInitialData: async () => {
    set({ isLoading: true });
    try {
      const [surplus, missions, impact] = await Promise.all([
        api.getSurplusItems(),
        api.getRescueMissions(),
        api.getImpactMetrics(),
      ]);
      set({
        surplusList: surplus,
        missionsList: missions,
        impactMetrics: impact,
        isLoading: false,
      });
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
      set({ isLoading: false });
    }
  },

  logSurplus: async (item) => {
    const newItem = await api.logSurplusItem(item);
    set(state => ({
      surplusList: [newItem, ...state.surplusList],
      impactMetrics: state.impactMetrics ? {
        ...state.impactMetrics,
        totalMealsRecovered: state.impactMetrics.totalMealsRecovered + newItem.portions,
        totalKgRecovered: state.impactMetrics.totalKgRecovered + newItem.quantityKg,
        methaneAvoidedKg: state.impactMetrics.methaneAvoidedKg + newItem.methaneAvoidedKg,
      } : null,
    }));
    return newItem;
  },

  dispatchMission: async (surplusId, vehicleType) => {
    const mission = await api.dispatchMission(surplusId, vehicleType);
    set(state => ({
      surplusList: state.surplusList.map(s => s.id === surplusId ? { ...s, status: 'dispatching' } : s),
      missionsList: [mission, ...state.missionsList],
    }));
    return mission;
  },

  verifyMissionDelivery: async (missionId, otp) => {
    const success = await api.verifyDelivery(missionId, otp);
    if (success) {
      set(state => ({
        missionsList: state.missionsList.map(m => m.id === missionId ? { ...m, status: 'delivered_human' } : m),
        surplusList: state.surplusList.map(s => {
          const match = state.missionsList.find(m => m.id === missionId);
          if (match && match.surplusItem.id === s.id) {
            return { ...s, status: 'delivered_human' };
          }
          return s;
        }),
      }));
    }
    return success;
  },

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedUrgency: (selectedUrgency) => set({ selectedUrgency }),
  toggleSimulation: () => set(state => ({ liveSimulationActive: !state.liveSimulationActive })),
}));
