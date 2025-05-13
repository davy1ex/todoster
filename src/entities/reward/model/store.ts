import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Reward, RewardStore } from "./types";

// Helper function to ensure dates are properly parsed
const parseDates = (reward: Reward): Reward => ({
  ...reward,
  createdAt: new Date(reward.createdAt),
  updatedAt: new Date(reward.updatedAt),
  archivedAt: reward.archivedAt ? new Date(reward.archivedAt) : undefined,
});

export const rewardStore = create<RewardStore>()(
  persist(
    (set, get) => ({
      totalCoins: 0,
      rewards: [],
      archivedRewards: [],

      addCoins: (amount: number) =>
        set((state) => ({
          totalCoins: state.totalCoins + amount,
        })),

      removeCoins: (amount: number) =>
        set((state) => ({
          totalCoins: Math.max(0, state.totalCoins - amount),
        })),

      resetCoins: () => set({ totalCoins: 0 }),

      addReward: (reward) =>
        set((state) => ({
          rewards: [
            ...state.rewards,
            {
              ...reward,
              id: Date.now(),
              createdAt: new Date(),
              updatedAt: new Date(),
              isArchived: false,
            },
          ],
        })),

      deleteReward: (id) =>
        set((state) => ({
          rewards: state.rewards.filter((reward) => reward.id !== id),
          archivedRewards: state.archivedRewards.filter(
            (reward) => reward.id !== id
          ),
        })),

      claimReward: (id) => {
        const reward = get().rewards.find((r) => r.id === id);
        if (!reward) return;

        const currentCoins = get().totalCoins;
        if (currentCoins >= reward.cost) {
          set((state) => ({
            totalCoins: state.totalCoins - reward.cost,
          }));
        }
      },

      updateReward: (id, updates) =>
        set((state) => ({
          rewards: state.rewards.map((reward) =>
            reward.id === id
              ? {
                  ...reward,
                  ...updates,
                  updatedAt: new Date(),
                }
              : reward
          ),
          archivedRewards: state.archivedRewards.map((reward) =>
            reward.id === id
              ? {
                  ...reward,
                  ...updates,
                  updatedAt: new Date(),
                }
              : reward
          ),
        })),

      archiveReward: (id) =>
        set((state) => {
          const rewardToArchive = state.rewards.find((r) => r.id === id);
          if (!rewardToArchive) return state;

          const archivedReward = {
            ...rewardToArchive,
            isArchived: true,
            archivedAt: new Date(),
          };

          return {
            ...state,
            rewards: state.rewards.filter((r) => r.id !== id),
            archivedRewards: [...state.archivedRewards, archivedReward],
          };
        }),

      unarchiveReward: (id) =>
        set((state) => {
          const rewardToUnarchive = state.archivedRewards.find(
            (r) => r.id === id
          );
          if (!rewardToUnarchive) return state;

          const unarchivedReward = {
            ...rewardToUnarchive,
            isArchived: false,
            archivedAt: undefined,
          };

          return {
            ...state,
            archivedRewards: state.archivedRewards.filter((r) => r.id !== id),
            rewards: [...state.rewards, unarchivedReward],
          };
        }),

      getArchivedRewards: () => get().archivedRewards.map(parseDates),

      clearArchive: () =>
        set((state) => ({
          ...state,
          archivedRewards: [],
        })),
    }),
    {
      name: "rewards-storage",
      onRehydrateStorage: () => (state) => {
        // Ensure dates are parsed after rehydration
        if (state) {
          state.rewards = state.rewards.map(parseDates);
          state.archivedRewards = state.archivedRewards.map(parseDates);
        }
      },
    }
  )
);
