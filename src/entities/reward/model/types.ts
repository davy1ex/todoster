export interface Reward {
  id: number;
  title: string;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  archivedAt?: Date;
}

export interface RewardStore {
  totalCoins: number;
  rewards: Reward[];
  archivedRewards: Reward[];
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
  archiveReward: (id: number) => void;
  unarchiveReward: (id: number) => void;
  getArchivedRewards: () => Reward[];
  clearArchive: () => void;
}
