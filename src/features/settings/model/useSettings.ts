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
    localStorage.clear();
    window.location.reload();
  }, []);

  const exportAccountData = useCallback(() => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gamified-todo-backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const importAccountData = useCallback((data: string) => {
    try {
      const parsedData = JSON.parse(data);
      Object.entries(parsedData).forEach(([key, value]) => {
        localStorage.setItem(key, value as string);
      });
      window.location.reload();
    } catch (error) {
      console.error("Failed to import data:", error);
      alert("Failed to import data. Please check the file format.");
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
