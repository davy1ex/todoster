import { goalStore } from "./store";
import { projectStore } from "../../project/model/store";

export const migrateGoalProjectLinks = () => {
  const goals = goalStore.getState().goals;
  const projects = projectStore.getState().projects;

  // Reset all project goalIds
  projects.forEach((project) => {
    projectStore.getState().updateProject(project.id, {
      goalIds: [],
    });
  });

  // Rebuild links from goals
  goals.forEach((goal) => {
    if (goal.projectId) {
      projectStore.getState().linkGoal(goal.projectId, goal.id);
    }
  });
};
