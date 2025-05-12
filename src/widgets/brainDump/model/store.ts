import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BrainDumpStore, BrainDump } from "./types";

const generateId = () => Math.random().toString(36).substring(2, 15);

const useBrainDumpStore = create<BrainDumpStore>()(
  persist(
    (set, get) => ({
      dumps: [],
      sharedContent: "",
      activeDumpId: null,
      createDump: () => {
        const newDump: BrainDump = {
          id: generateId(),
          title: `New Note ${get().dumps.length + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          dumps: [...state.dumps, newDump],
          activeDumpId: newDump.id,
        }));
      },
      updateContent: (content: string) => {
        set((state) => ({
          sharedContent: content,
          dumps: state.dumps.map((dump) => ({
            ...dump,
            updatedAt: new Date().toISOString(),
          })),
        }));
      },
      updateTitle: (id: string, title: string) => {
        set((state) => ({
          dumps: state.dumps.map((dump) =>
            dump.id === id
              ? { ...dump, title, updatedAt: new Date().toISOString() }
              : dump
          ),
        }));
      },
      getActiveDump: () => {
        const state = get();
        return state.dumps.find((dump) => dump.id === state.activeDumpId);
      },
      setActiveDump: (id: string) => {
        set({ activeDumpId: id });
      },
      deleteDump: (id: string) => {
        set((state) => ({
          dumps: state.dumps.filter((dump) => dump.id !== id),
        }));
      },
    }),
    {
      name: "brain-dump-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export { useBrainDumpStore };
