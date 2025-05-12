export type Task = {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  list: string;
  reward: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskStore = {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  changeReward: (id: number, amount: number) => void;
  checkTask: (id: number) => void;
};
