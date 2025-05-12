import { create } from "zustand";
import type { Task } from "./type";

type TaskStore = {
  tasks: Task[];
  addTask: (task: Task) => void;
  checkTask: (id: number) => void;
  changeReward: (id: number, reward: number) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
};

export const taskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  checkTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    })),
  changeReward: (id, reward) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, reward } : task,
      ),
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task,
      ),
    })),
}));
