import { create } from "zustand";
import type { Task, UrgencyLevel, ImportanceLevel } from "@/entities/task";
import { taskStore } from "@/entities/task";

interface TaskCreationStore {
  createTask: (task: Partial<Task>) => void;
}

export const useTaskCreation = create<TaskCreationStore>((set, get) => ({
  createTask: (taskData) => {
    const task: Task = {
      id: Date.now(),
      title: taskData.title || "",
      description: taskData.description || "",
      isDone: false,
      list: taskData.list || "Inbox",
      reward: taskData.reward || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      date_box: taskData.date_box ?? "later",
      urgent: taskData.urgent ?? null,
      important: taskData.important ?? null,
    };

    taskStore.getState().addTask(task);
  },
}));
