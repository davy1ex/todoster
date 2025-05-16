import { create } from "zustand";
import type { Task, DateBox } from "@/entities/task";

interface TaskFilteringStore {
  selectedDateBox: DateBox;
  setSelectedDateBox: (dateBox: DateBox) => void;
  getFilteredTasks: (tasks: Task[], listType: string) => Task[];
  getTaskCounts: (tasks: Task[]) => {
    today: number;
    week: number;
    later: number;
  };
}

export const useTaskFiltering = create<TaskFilteringStore>((set, get) => ({
  selectedDateBox: "today",

  setSelectedDateBox: (dateBox) => set({ selectedDateBox: dateBox }),

  getFilteredTasks: (tasks, listType) => {
    // For Inbox, show only Inbox tasks without date_box filtering
    if (listType === "Inbox") {
      return tasks.filter((task) => task.list === "Inbox");
    }

    // For Backlog, filter by both list and date_box
    if (listType.toLowerCase() === "backlog") {
      return tasks.filter(
        (task) =>
          task.list.toLowerCase() === "backlog" &&
          task.date_box === get().selectedDateBox
      );
    }

    // For any other list, just filter by list name
    return tasks.filter((task) => task.list === listType);
  },

  getTaskCounts: (tasks) => ({
    today: tasks.filter(
      (task) => task.list === "Backlog" && task.date_box === "today"
    ).length,
    week: tasks.filter(
      (task) => task.list === "Backlog" && task.date_box === "week"
    ).length,
    later: tasks.filter(
      (task) => task.list === "Backlog" && task.date_box === "later"
    ).length,
  }),
}));
