import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createStorage } from "@/shared/lib/storage";
import { getPlatform } from "@/app/lib/platform";
import type { Task, TaskStore } from "./type";
import { rewardStore } from "../../reward/model/store";

// Helper to get initial tasks from storage or empty array
const storage = createStorage(getPlatform());

// Helper to get initial tasks from localStorage or empty array
const getInitialTasks = (): Task[] => {
  const savedTasks = localStorage.getItem("tasks");
  if (!savedTasks) return [];

  const tasks = JSON.parse(savedTasks);
  return tasks.map((task: Task) => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  }));
};

export const taskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: getInitialTasks(),
      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: state.tasks.length
                ? Math.max(...state.tasks.map((t) => t.id)) + 1
                : 1,
            },
          ],
        })),
      removeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      checkTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, checked: !task.checked } : task
          ),
        })),
      changeReward: (id, reward) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, reward } : task
          ),
        })),
      clearTasks: () => set({ tasks: [] }),
      importTasks: (tasks: Task[]) => set({ tasks }),
    }),
    {
      name: "tasks",
      storage: {
        getItem: async (name) => {
          const value = await storage.getItem(name);
          return value ?? null;
        },
        setItem: async (name, value) => {
          await storage.setItem(name, value);
        },
        removeItem: async (name) => {
          await storage.removeItem(name);
        },
      },
    }
  )
);
