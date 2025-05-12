import { Task } from "@/entities/task";

export interface TaskManagementContextType {
  isModalOpen: boolean;
  selectedTask: Task | null;
  openTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
  handleTaskUpdate: (id: number, updates: Partial<Task>) => void;
  handleRewardChange: (amount: number) => void;
  handleTaskCheck: (id: number) => void;
}
