import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, TaskStore } from "./type";
import { rewardStore } from "../../reward/model/store";

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
      addTask: (task: Task) =>
        set((state: TaskStore) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateTask: (id: number, updates: Partial<Task>) =>
        set((state: TaskStore) => ({
          tasks: state.tasks.map((task: Task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: new Date(),
                }
              : task
          ),
        })),
      deleteTask: (id: number) =>
        set((state: TaskStore) => ({
          tasks: state.tasks.filter((task: Task) => task.id !== id),
        })),
      changeReward: (id: number, amount: number) =>
        set((state: TaskStore) => ({
          tasks: state.tasks.map((task: Task) =>
            task.id === id
              ? {
                  ...task,
                  reward: amount,
                  updatedAt: new Date(),
                }
              : task
          ),
        })),
      checkTask: (id: number) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        // If task is being completed, add coins. If being unchecked, remove coins
        if (!task.isDone) {
          rewardStore.getState().addCoins(task.reward);
        } else {
          rewardStore.getState().removeCoins(task.reward);
        }

        set((state: TaskStore) => ({
          tasks: state.tasks.map((task: Task) =>
            task.id === id
              ? {
                  ...task,
                  isDone: !task.isDone,
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },
      clearTasks: () => set({ tasks: [] }),
      importTasks: (tasks: Task[]) => set({ tasks }),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
);
