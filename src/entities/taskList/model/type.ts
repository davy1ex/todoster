import type { Task } from "../../task";

export type TaskList = {
  id: number;
  title: string;
  tasks: Task[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};
