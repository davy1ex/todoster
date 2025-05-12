import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BrainDump, BrainDumpStore } from "./type";

export const brainDumpStore = create<BrainDumpStore>()(
  persist(
    (set) => ({
      dumps: [],
      currentDump: "",
      addDump: (content: string) =>
        set((state) => ({
          dumps: [
            ...state.dumps,
            {
              id: Date.now(),
              content,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          currentDump: "", // Reset current dump after saving
        })),
      updateCurrentDump: (content: string) =>
        set(() => ({
          currentDump: content,
        })),
      deleteDump: (id: number) =>
        set((state) => ({
          dumps: state.dumps.filter((dump) => dump.id !== id),
        })),
    }),
    {
      name: "brain-dump-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dumps: state.dumps,
        currentDump: state.currentDump,
      }),
    },
  ),
);
