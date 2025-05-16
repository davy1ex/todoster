export type DateBox = "today" | "week" | "later";

export type Task = {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  list: string;
  reward: number;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  archivedAt?: Date;
  date_box: DateBox;
};

export type TaskStore = {
  tasks: Task[];
  archivedTasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  archiveTask: (id: number) => void;
  unarchiveTask: (id: number) => void;
  changeReward: (id: number, amount: number) => void;
  checkTask: (id: number) => void;
  getArchivedTasks: () => Task[];
  clearArchive: () => void;
  getTasksByDateBox: (dateBox: DateBox) => Task[];
};
