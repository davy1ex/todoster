import { create } from "zustand";
import type { Task } from "@/entities/task";
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
      date_box:
        taskData.list === "Backlog" ? taskData.date_box || "today" : "later",
    };

    taskStore.getState().addTask(task);
  },
}));
