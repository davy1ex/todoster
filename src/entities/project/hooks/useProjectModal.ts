import { useState, useCallback, useEffect } from "react";
import { Project, ProjectStatus } from "../model/types";
import { projectStore } from "../model/store";
import { taskStore } from "@/entities/task";
import type { Task } from "@/entities/task";
import type { Goal } from "../../goal/model/types";

export const useProjectModal = (initialProject: Project) => {
  // Get latest project data from store
  const project =
    projectStore((state) => state.getProjectById(initialProject.id)) ||
    initialProject;

  // Get task-related data and actions from store
  const tasks = taskStore((state) => state.tasks);
  const addTask = taskStore((state) => state.addTask);
  const checkTask = taskStore((state) => state.checkTask);
  const updateTask = taskStore((state) => state.updateTask);

  // Local state
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");

  // Update local state when project changes
  useEffect(() => {
    setTitle(project.title);
    setDescription(project.description);
  }, [project]);

  // Handlers
  const handleUpdateTitle = useCallback(
    (
      newTitle: string,
      onUpdateProject: (id: number, updates: Partial<Project>) => void
    ) => {
      if (newTitle.trim()) {
        setTitle(newTitle);
        onUpdateProject(project.id, { title: newTitle });
      }
      setEditingTitle(false);
    },
    [project.id]
  );

  const handleUpdateDescription = useCallback(
    (
      newDescription: string,
      onUpdateProject: (id: number, updates: Partial<Project>) => void
    ) => {
      setDescription(newDescription);
      onUpdateProject(project.id, { description: newDescription });
      setEditingDescription(false);
    },
    [project.id]
  );

  const handleAddNewTask = useCallback(
    (
      taskTitle: string,
      onLinkTask: (projectId: number, taskId: number) => void
    ) => {
      if (taskTitle.trim()) {
        const newTask: Task = {
          id: Date.now(),
          title: taskTitle,
          description: "",
          isDone: false,
          list: "Backlog",
          reward: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addTask(newTask);
        onLinkTask(project.id, newTask.id);
      }
    },
    [project.id, addTask]
  );

  const handleAddGoal = useCallback(
    (
      addGoalToProject: (
        projectId: number,
        goal: Omit<Goal, "id" | "createdAt" | "updatedAt" | "projectId">
      ) => void
    ) => {
      if (newGoalTitle.trim()) {
        addGoalToProject(project.id, {
          title: newGoalTitle,
          description: newGoalDescription,
          isCompleted: false,
          priority: "medium",
        });
        setNewGoalTitle("");
        setNewGoalDescription("");
      }
    },
    [project.id, newGoalTitle, newGoalDescription]
  );

  return {
    // State
    project,
    tasks,
    title,
    description,
    editingTitle,
    editingDescription,
    newGoalTitle,
    newGoalDescription,

    // Setters
    setTitle,
    setDescription,
    setEditingTitle,
    setEditingDescription,
    setNewGoalTitle,
    setNewGoalDescription,

    // Task Actions
    addTask,
    checkTask,
    updateTask,

    // Handlers
    handleUpdateTitle,
    handleUpdateDescription,
    handleAddNewTask,
    handleAddGoal,
  };
};
