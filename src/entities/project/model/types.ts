export type ProjectStatus = "not_started" | "active" | "archived";

export interface Goal {
  id: number;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  goals: Goal[];
  linkedTaskIds: number[];
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    linkedTasksCount: number;
  };
}
