import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, TaskStore, DateBox } from "./type";
import { rewardStore } from "../../reward/model/store";
import { assignOrder, sortByOrder } from "@/shared/lib/sortable";

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
        set((state) => {
          // Find max order value and assign new task order + 1
          const maxOrder = state.tasks.reduce(
            (max, t) => Math.max(max, t.order ?? -1),
            -1
          );
          
          return {
          tasks: [
            ...state.tasks,
            {
              ...task,
              reward: task.reward || 10,
              id: Date.now(),
              createdAt: new Date(),
              updatedAt: new Date(),
              isArchived: false,
              date_box: task.date_box || "later",
                order: maxOrder + 1,
            },
          ],
          };
        }),

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
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const newIsDone = !task.isDone;
          const rewardAmount = task.reward || 1; // Default reward is 1 if not specified

          if (newIsDone) {
            // Add coins when task is completed
            rewardStore.getState().addCoins(rewardAmount);
          } else {
            // Remove coins when task is uncompleted
            rewardStore.getState().removeCoins(rewardAmount);
          }

          return {
            tasks: state.tasks.map((t) =>
              t.id === id
                ? { ...t, isDone: newIsDone, updatedAt: new Date() }
                : t
          ),
          };
        }),

      getArchivedTasks: () => get().archivedTasks.map(parseDates),

      clearArchive: () =>
        set((state) => ({
          ...state,
          archivedTasks: [],
        })),

      getTasksByDateBox: (dateBox) =>
        sortByOrder(get().tasks.filter((task) => task.date_box === dateBox)),

      reorderTasks: (tasks) =>
        set((state) => {
          // Validate input
          if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
            return state;
          }
          
          // Ensure all tasks have an id property
          const validTasks = tasks.filter(task => task && typeof task.id !== 'undefined');
          if (validTasks.length === 0) {
            return state;
          }
          
          // Create a map for quick lookups
          const taskMap = new Map(
            validTasks.map((task, index) => [task.id, index])
          );
          
          // Apply the new order to state tasks
          const updatedTasks = state.tasks.map(task => {
            if (taskMap.has(task.id)) {
              return {
                ...task,
                order: taskMap.get(task.id),
                updatedAt: new Date(),
              };
            }
            return task;
          });
          
          return { tasks: updatedTasks };
        }),
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
