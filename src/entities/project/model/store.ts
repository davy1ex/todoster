import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Project, Goal, ProjectStatus } from "./types";

interface ProjectStore {
  projects: Project[];
  addProject: (title: string, description: string) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  addGoal: (projectId: number, title: string, description?: string) => void;
  updateGoal: (
    projectId: number,
    goalId: number,
    updates: Partial<Goal>
  ) => void;
  removeGoal: (projectId: number, goalId: number) => void;
  linkTask: (projectId: number, taskId: number) => void;
  unlinkTask: (projectId: number, taskId: number) => void;
  updateProjectStatus: (projectId: number, status: ProjectStatus) => void;
  getProjectById: (id: number) => Project | undefined;
  getFilteredProjects: (
    status?: ProjectStatus,
    hasLinkedTasks?: boolean
  ) => Project[];
}

// Helper to get initial projects from localStorage or empty array
const getInitialProjects = (): Project[] => {
  const savedProjects = localStorage.getItem("projects");
  if (!savedProjects) return [];

  const projects = JSON.parse(savedProjects);
  return projects.map((project: Project) => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
    goals: project.goals.map((goal) => ({
      ...goal,
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
    })),
  }));
};

export const projectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: getInitialProjects(),

      addProject: (title: string, description: string) => {
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: Date.now(),
              title,
              description,
              status: "not_started" as ProjectStatus,
              goals: [],
              linkedTaskIds: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              metadata: {
                linkedTasksCount: 0,
              },
            },
          ],
        }));
      },

      updateProject: (id: number, updates: Partial<Project>) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
        }));
      },

      addGoal: (projectId: number, title: string, description?: string) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  goals: [
                    ...project.goals,
                    {
                      id: Date.now(),
                      title,
                      description,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    },
                  ],
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      updateGoal: (
        projectId: number,
        goalId: number,
        updates: Partial<Goal>
      ) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  goals: project.goals.map((goal) =>
                    goal.id === goalId
                      ? { ...goal, ...updates, updatedAt: new Date() }
                      : goal
                  ),
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      removeGoal: (projectId: number, goalId: number) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  goals: project.goals.filter((goal) => goal.id !== goalId),
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      linkTask: (projectId: number, taskId: number) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId &&
            !project.linkedTaskIds.map((id) => Number(id)).includes(taskId)
              ? {
                  ...project,
                  linkedTaskIds: [...project.linkedTaskIds, taskId],
                  metadata: {
                    ...project.metadata,
                    linkedTasksCount: project.linkedTaskIds.length + 1,
                  },
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      unlinkTask: (projectId: number, taskId: number) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  linkedTaskIds: project.linkedTaskIds.filter(
                    (id) => Number(id) !== taskId
                  ),
                  metadata: {
                    ...project.metadata,
                    linkedTasksCount: project.linkedTaskIds.filter(
                      (id) => Number(id) !== taskId
                    ).length,
                  },
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      updateProjectStatus: (projectId: number, status: ProjectStatus) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? { ...project, status, updatedAt: new Date() }
              : project
          ),
        }));
      },

      getProjectById: (id: number) => {
        return get().projects.find((project) => project.id === id);
      },

      getFilteredProjects: (
        status?: ProjectStatus,
        hasLinkedTasks?: boolean
      ) => {
        let filtered = [...get().projects];

        if (status) {
          filtered = filtered.filter((project) => project.status === status);
        }

        if (hasLinkedTasks !== undefined) {
          filtered = filtered.filter((project) =>
            hasLinkedTasks
              ? project.linkedTaskIds.length > 0
              : project.linkedTaskIds.length === 0
          );
        }

        return filtered;
      },
    }),
    {
      name: "project-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ projects: state.projects }), // only persist projects array
    }
  )
);
