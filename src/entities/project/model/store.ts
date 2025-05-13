import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Project, ProjectStatus } from "./types";
import { goalStore } from "../../goal/model/store";

interface ProjectStore {
  projects: Project[];
  isInputOpen: boolean;
  addProject: (name: string) => void;
  removeProject: (id: number) => void;
  openProjectInput: () => void;
  closeProjectInput: () => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  linkGoal: (projectId: number, goalId: number) => void;
  unlinkGoal: (projectId: number, goalId: number) => void;
  linkTask: (projectId: number, taskId: number) => void;
  unlinkTask: (projectId: number, taskId: number) => void;
  updateProjectStatus: (projectId: number, status: ProjectStatus) => void;
  getProjectById: (id: number) => Project | undefined;
  getFilteredProjects: (
    status?: ProjectStatus,
    hasLinkedTasks?: boolean
  ) => Project[];
  clearProjects: () => void;
  importProjects: (projects: Project[]) => void;
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
    goalIds: project.goalIds || [], // Ensure goalIds exists
  }));
};

export const projectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: getInitialProjects(),
      isInputOpen: false,

      addProject: (name) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: Date.now(), // Using timestamp as numeric ID
              title: name,
              description: "",
              status: "not_started" as ProjectStatus,
              goalIds: [],
              linkedTaskIds: [],
              createdAt: new Date(),
              updatedAt: new Date(),
              metadata: {
                linkedTasksCount: 0,
              },
            },
          ],
          isInputOpen: false,
        })),

      removeProject: (id: number) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      openProjectInput: () => set({ isInputOpen: true }),

      closeProjectInput: () => set({ isInputOpen: false }),

      updateProject: (id: number, updates: Partial<Project>) => {
        // If goalIds is being updated, ensure it's an array
        if ("goalIds" in updates) {
          updates.goalIds = updates.goalIds || [];
        }

        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
        }));
      },

      linkGoal: (projectId: number, goalId: number) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project || project.goalIds.includes(goalId)) return;

        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  goalIds: [...project.goalIds, goalId],
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      unlinkGoal: (projectId: number, goalId: number) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  goalIds: project.goalIds.filter((id) => id !== goalId),
                  updatedAt: new Date(),
                }
              : project
          ),
        }));
      },

      linkTask: (projectId: number, taskId: number) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId && !project.linkedTaskIds.includes(taskId)
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
                    (id) => id !== taskId
                  ),
                  metadata: {
                    ...project.metadata,
                    linkedTasksCount: project.linkedTaskIds.filter(
                      (id) => id !== taskId
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
          filtered = filtered.filter(
            (project) => project.linkedTaskIds.length > 0 === hasLinkedTasks
          );
        }

        return filtered;
      },

      clearProjects: () => set({ projects: [] }),
      importProjects: (projects) => {
        // Ensure all projects have goalIds array
        const projectsWithGoalIds = projects.map((project) => ({
          ...project,
          goalIds: project.goalIds || [],
        }));
        set({ projects: projectsWithGoalIds });
      },
    }),
    {
      name: "projects-storage",
    }
  )
);
