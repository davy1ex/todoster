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
const getInitialTasks = async (): Promise<{
  tasks: Task[];
  archivedTasks: Task[];
}> => {
  try {
    const savedTasks = await storage.getItem("tasks");
    const savedArchivedTasks = await storage.getItem("archivedTasks");

    const parseTasks = (tasksStr: string | null): Task[] => {
      if (!tasksStr) return [];
      const tasks = JSON.parse(tasksStr);
      if (!Array.isArray(tasks)) return [];
      return tasks.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        archivedAt: task.archivedAt ? new Date(task.archivedAt) : undefined,
      }));
    };

    return {
      tasks: parseTasks(savedTasks),
      archivedTasks: parseTasks(savedArchivedTasks),
    };
  } catch (error) {
    console.error("Error loading tasks:", error);
    return { tasks: [], archivedTasks: [] };
  }
};

export const taskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      archivedTasks: [],

      addTask: (task: Task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: state.tasks.length
                ? Math.max(...state.tasks.map((t) => t.id)) + 1
                : 1,
              isArchived: false,
            },
          ],
        })),

      deleteTask: (id: number) =>
        set((state) => {
          // Remove from either active or archived tasks
          const newTasks = state.tasks.filter((task) => task.id !== id);
          const newArchivedTasks = state.archivedTasks.filter(
            (task) => task.id !== id
          );

          return {
            tasks: newTasks,
            archivedTasks: newArchivedTasks,
          };
        }),

      archiveTask: (id: number) =>
        set((state) => {
          const taskToArchive = state.tasks.find((t) => t.id === id);
          if (!taskToArchive) return state;

          const archivedTask = {
            ...taskToArchive,
            isArchived: true,
            archivedAt: new Date(),
          };

          return {
            tasks: state.tasks.filter((t) => t.id !== id),
            archivedTasks: [...state.archivedTasks, archivedTask],
          };
        }),

      unarchiveTask: (id: number) =>
        set((state) => {
          const taskToUnarchive = state.archivedTasks.find((t) => t.id === id);
          if (!taskToUnarchive) return state;

          const unarchivedTask = {
            ...taskToUnarchive,
            isArchived: false,
            archivedAt: undefined,
          };

          return {
            archivedTasks: state.archivedTasks.filter((t) => t.id !== id),
            tasks: [...state.tasks, unarchivedTask],
          };
        }),

      updateTask: (id: number, updates: Partial<Task>) =>
        set((state) => {
          // Check both active and archived tasks
          const isArchived = state.archivedTasks.some((t) => t.id === id);

          if (isArchived) {
            return {
              ...state,
              archivedTasks: state.archivedTasks.map((task) =>
                task.id === id ? { ...task, ...updates } : task
              ),
            };
          }

          return {
            ...state,
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
          };
        }),

      checkTask: (id: number) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const newIsDone = !task.isDone;

          // Add coins when completing task, remove when uncompleting
          if (newIsDone) {
            rewardStore.getState().addCoins(task.reward);
          } else {
            rewardStore.getState().removeCoins(task.reward);
          }

          return {
            ...state,
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, isDone: newIsDone } : task
            ),
          };
        }),

      changeReward: (id: number, amount: number) =>
        set((state) => {
          // Check both active and archived tasks
          const isArchived = state.archivedTasks.some((t) => t.id === id);

          if (isArchived) {
            return {
              ...state,
              archivedTasks: state.archivedTasks.map((task) =>
                task.id === id ? { ...task, reward: amount } : task
              ),
            };
          }

          return {
            ...state,
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, reward: amount } : task
            ),
          };
        }),

      getArchivedTasks: () => get().archivedTasks,

      clearArchive: () =>
        set((state) => ({
          ...state,
          archivedTasks: [],
        })),
    }),
    {
      name: "tasks",
      storage: createJSONStorage(() => storageAdapter),
    }
  )
);

// Initialize tasks from storage
getInitialTasks().then(({ tasks, archivedTasks }) => {
  taskStore.setState({ tasks, archivedTasks });
});
