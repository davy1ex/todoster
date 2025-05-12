import { create } from "zustand";
import type { Task, TaskStore } from "../type";

export const taskStore = create<TaskStore>((set) => ({
  tasks: [],
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
}));
