import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Goal, GoalStore } from "./types";
import { projectStore } from "../../project/model/store";

// Helper function to ensure dates are properly parsed
const parseDates = (goal: Goal): Goal => ({
  ...goal,
  createdAt: new Date(goal.createdAt),
  updatedAt: new Date(goal.updatedAt),
  deadline: goal.deadline ? new Date(goal.deadline) : undefined,
  archivedAt: goal.archivedAt ? new Date(goal.archivedAt) : undefined,
});

export const goalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      archivedGoals: [],

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
              isArchived: false,
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
        const currentGoal =
          get().goals.find((g) => g.id === id) ||
          get().archivedGoals.find((g) => g.id === id);
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
          archivedGoals: state.archivedGoals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date() }
              : goal
          ),
        }));
      },

      deleteGoal: (id) => {
        const goal =
          get().goals.find((g) => g.id === id) ||
          get().archivedGoals.find((g) => g.id === id);
        if (goal?.projectId) {
          projectStore.getState().unlinkGoal(goal.projectId, id);
        }
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
          archivedGoals: state.archivedGoals.filter((goal) => goal.id !== id),
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
          archivedGoals: state.archivedGoals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  isCompleted: !goal.isCompleted,
                  updatedAt: new Date(),
                }
              : goal
          ),
        })),

      getGoalsByProjectId: (projectId) => [
        ...get().goals.filter((goal) => goal.projectId === projectId),
        ...get().archivedGoals.filter((goal) => goal.projectId === projectId),
      ],

      clearGoals: () => {
        const allGoals = [...get().goals, ...get().archivedGoals];
        allGoals.forEach((goal) => {
          if (goal.projectId) {
            projectStore.getState().unlinkGoal(goal.projectId, goal.id);
          }
        });
        set({ goals: [], archivedGoals: [] });
      },

      importGoals: (goals) => {
        get().clearGoals();
        const activeGoals = goals
          .filter((goal) => !goal.isArchived)
          .map(parseDates);
        const archivedGoals = goals
          .filter((goal) => goal.isArchived)
          .map(parseDates);

        set({ goals: activeGoals, archivedGoals });
        goals.forEach((goal) => {
          if (goal.projectId) {
            projectStore.getState().linkGoal(goal.projectId, goal.id);
          }
        });
      },

      archiveGoal: (id) =>
        set((state) => {
          const goalToArchive = state.goals.find((g) => g.id === id);
          if (!goalToArchive) return state;

          const archivedGoal = {
            ...goalToArchive,
            isArchived: true,
            archivedAt: new Date(),
          };

          return {
            goals: state.goals.filter((g) => g.id !== id),
            archivedGoals: [...state.archivedGoals, archivedGoal],
          };
        }),

      unarchiveGoal: (id) =>
        set((state) => {
          const goalToUnarchive = state.archivedGoals.find((g) => g.id === id);
          if (!goalToUnarchive) return state;

          const unarchivedGoal = {
            ...goalToUnarchive,
            isArchived: false,
            archivedAt: undefined,
          };

          return {
            archivedGoals: state.archivedGoals.filter((g) => g.id !== id),
            goals: [...state.goals, unarchivedGoal],
          };
        }),

      getArchivedGoals: () => get().archivedGoals.map(parseDates),

      clearArchive: () =>
        set((state) => ({
          ...state,
          archivedGoals: [],
        })),
    }),
    {
      name: "goals-storage",
      onRehydrateStorage: () => (state) => {
        // Ensure dates are parsed after rehydration
        if (state) {
          state.goals = state.goals.map(parseDates);
          state.archivedGoals = state.archivedGoals.map(parseDates);
        }
      },
    }
  )
);
