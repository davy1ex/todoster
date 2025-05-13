export interface Goal {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  projectId?: number; // Optional link to a project
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  priority: "low" | "medium" | "high";
}
