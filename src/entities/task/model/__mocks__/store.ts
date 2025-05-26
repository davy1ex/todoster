import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, TaskStore, DateBox } from "../type";

// Helper function to ensure dates are properly parsed
const parseDates = (task: Task): Task => ({
  ...task,
  createdAt: new Date(task.createdAt),
  updatedAt: new Date(task.updatedAt),
  archivedAt: task.archivedAt ? new Date(task.archivedAt) : undefined,
});

export const taskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      archivedTasks: [],

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: Date.now(),
              createdAt: new Date(),
              updatedAt: new Date(),
              isArchived: false,
              date_box: task.date_box || "later",
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
          archivedTasks: state.archivedTasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          archivedTasks: state.archivedTasks.filter((task) => task.id !== id),
        })),

      archiveTask: (id) =>
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

      unarchiveTask: (id) =>
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

      changeReward: (id, amount) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, reward: amount } : task
          ),
        })),

      checkTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, isDone: !task.isDone, updatedAt: new Date() }
              : task
          ),
        })),

      getArchivedTasks: () => get().archivedTasks.map(parseDates),

      clearArchive: () =>
        set((state) => ({
          ...state,
          archivedTasks: [],
        })),

      getTasksByDateBox: (dateBox) =>
        get().tasks.filter((task) => task.date_box === dateBox),
    }),
    {
      name: "tasks-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        archivedTasks: state.archivedTasks,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.tasks = state.tasks.map(parseDates);
          state.archivedTasks = state.archivedTasks.map(parseDates);
        }
      },
    }
  )
);
