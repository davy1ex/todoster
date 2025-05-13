import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Reward } from "./types";

interface RewardStore {
  totalCoins: number;
  rewards: Reward[];
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
  resetCoins: () => void;
  addReward: (reward: Omit<Reward, "id" | "createdAt" | "updatedAt">) => void;
  deleteReward: (id: number) => void;
  claimReward: (id: number) => void;
  updateReward: (
    id: number,
    updates: Partial<Omit<Reward, "id" | "createdAt" | "updatedAt">>
  ) => void;
}

export const rewardStore = create<RewardStore>()(
  persist(
    (set, get) => ({
      totalCoins: 0,
      rewards: [],

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
            },
          ],
        })),

      deleteReward: (id) =>
        set((state) => ({
          rewards: state.rewards.filter((reward) => reward.id !== id),
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
        })),
    }),
    {
      name: "rewards-storage",
    }
  )
);
