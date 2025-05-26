import { create } from "zustand";
import type { Task } from "@/entities/task";
import type { DateBox } from "@/entities/task/model/type";
import { sortByOrder } from "@/shared/lib/sortable";

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
    let filtered: Task[];
    
    // For Inbox, show only Inbox tasks without date_box filtering
    if (listType === "Inbox") {
      filtered = tasks.filter((task) => task.list === "Inbox");
    }
    // For Backlog, filter by both list and date_box
    else if (listType.toLowerCase() === "backlog") {
      filtered = tasks.filter(
        (task) =>
          task.list.toLowerCase() === "backlog" &&
          task.date_box === get().selectedDateBox
      );
    }
    // For any other list, just filter by list name
    else {
      filtered = tasks.filter((task) => task.list === listType);
    }
    
    // Sort by order property
    return sortByOrder(filtered);
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
