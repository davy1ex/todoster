import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, TaskStore } from "./type";

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
    (set) => ({
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
              : task,
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
              : task,
          ),
        })),
      checkTask: (id: number) =>
        set((state: TaskStore) => ({
          tasks: state.tasks.map((task: Task) =>
            task.id === id
              ? {
                  ...task,
                  isDone: !task.isDone,
                  updatedAt: new Date(),
                }
              : task,
          ),
        })),
    }),
    {
      name: "task-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }), // only persist tasks array
    },
  ),
);
