import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Goal } from "./types";
import { projectStore } from "../../project/model/store";

interface GoalStore {
  goals: Goal[];
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
}

export const goalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (goal) => {
        const newGoalId = Date.now();
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: newGoalId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
        return newGoalId;
      },

      addGoalToProject: (projectId, goal) => {
        const newGoalId = get().addGoal({ ...goal, projectId });
        projectStore.getState().linkGoal(projectId, newGoalId);
      },

      updateGoal: (id, updates) => {
        const currentGoal = get().goals.find((g) => g.id === id);
        if (!currentGoal) return;

        if (
          "projectId" in updates &&
          updates.projectId !== currentGoal.projectId
        ) {
          if (currentGoal.projectId) {
            projectStore.getState().unlinkGoal(currentGoal.projectId, id);
          }
          if (updates.projectId) {
            projectStore.getState().linkGoal(updates.projectId, id);
          }
        }

        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date() }
              : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        const goal = get().goals.find((g) => g.id === id);
        if (goal?.projectId) {
          projectStore.getState().unlinkGoal(goal.projectId, id);
        }
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      toggleGoalCompletion: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  isCompleted: !goal.isCompleted,
                  updatedAt: new Date(),
                }
              : goal
          ),
        })),

      getGoalsByProjectId: (projectId) =>
        get().goals.filter((goal) => goal.projectId === projectId),

      clearGoals: () => {
        get().goals.forEach((goal) => {
          if (goal.projectId) {
            projectStore.getState().unlinkGoal(goal.projectId, goal.id);
          }
        });
        set({ goals: [] });
      },

      importGoals: (goals) => {
        get().clearGoals();

        set({ goals });
        goals.forEach((goal) => {
          if (goal.projectId) {
            projectStore.getState().linkGoal(goal.projectId, goal.id);
          }
        });
      },
    }),
    {
      name: "goals-storage",
    }
  )
);
