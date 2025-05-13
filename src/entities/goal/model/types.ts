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
  isArchived: boolean;
  archivedAt?: Date;
}

export interface GoalStore {
  goals: Goal[];
  archivedGoals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => number;
  addGoalToProject: (
    projectId: number,
    goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "projectId">
  ) => void;
  updateGoal: (id: number, updates: Partial<Goal>) => void;
  deleteGoal: (id: number) => void;
  toggleGoalCompletion: (id: number) => void;
  getGoalsByProjectId: (projectId: number) => Goal[];
  clearGoals: () => void;
  importGoals: (goals: Goal[]) => void;
  archiveGoal: (id: number) => void;
  unarchiveGoal: (id: number) => void;
  getArchivedGoals: () => Goal[];
  clearArchive: () => void;
}
