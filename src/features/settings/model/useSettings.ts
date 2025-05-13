import { useState, useCallback } from "react";
import { taskStore } from "@/entities/task";
import { projectStore } from "@/entities/project";
import { getExcalidrawData, setExcalidrawData } from "@/shared/lib/excalidraw";
import type { SettingsContextType } from "./types";

export const useSettings = (): SettingsContextType => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(true);
  }, []);

  const closeSettingsModal = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  const clearAccountData = useCallback(() => {
    // Clear all stores
    taskStore.getState().clearTasks();
    projectStore.getState().clearProjects();

    // Clear Excalidraw data
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("excalidraw")) {
        localStorage.removeItem(key);
      }
    });

    document.cookie.split(";").forEach((cookie) => {
      const key = cookie.split("=")[0].trim();
      if (key.startsWith("excalidraw")) {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });

    // Clear remaining localStorage
    localStorage.clear();
  }, []);

  const exportAccountData = useCallback(() => {
    const data = {
      tasks: taskStore.getState().tasks,
      projects: projectStore.getState().projects,
      excalidraw: getExcalidrawData(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gamified-todo-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importAccountData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);

      if (data.tasks) {
        taskStore.getState().importTasks(data.tasks);
      }

      if (data.projects) {
        projectStore.getState().importProjects(data.projects);
      }

      if (data.excalidraw) {
        setExcalidrawData(data.excalidraw);
      }

      // Reload the page to refresh Excalidraw iframe
      window.location.reload();
    } catch (error) {
      console.error("Failed to import data:", error);
      throw new Error("Invalid backup file format");
    }
  }, []);

  return {
    isSettingsModalOpen,
    openSettingsModal,
    closeSettingsModal,
    clearAccountData,
    exportAccountData,
    importAccountData,
  };
};
