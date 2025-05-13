import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { createStorage } from "@/shared/lib/storage";
import { getPlatform } from "@/app/lib/platform";
import type { Task, TaskStore } from "./type";
import { rewardStore } from "../../reward/model/store";

// Create platform-specific storage instance
const storage = createStorage(getPlatform());

// Create a storage adapter that implements StateStorage
const storageAdapter: StateStorage = {
  getItem: async (name: string) => {
    const value = await storage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await storage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await storage.removeItem(name);
  },
};

// Helper to get initial tasks from storage or empty array
const getInitialTasks = async (): Promise<Task[]> => {
  try {
    const savedTasks = await storage.getItem("tasks");
    if (!savedTasks) return [];

    const tasks = JSON.parse(savedTasks);
    if (!Array.isArray(tasks)) return [];

    return tasks.map((task: Task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export const taskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task: Task) =>
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
      deleteTask: (id: number) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      updateTask: (id: number, updates: Partial<Task>) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      checkTask: (id: number) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, isDone: !task.isDone } : task
          ),
        })),
      changeReward: (id: number, amount: number) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, reward: amount } : task
          ),
        })),
    }),
    {
      name: "tasks",
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);

// Initialize tasks from storage
getInitialTasks().then((tasks) => {
  taskStore.setState({ tasks });
});
