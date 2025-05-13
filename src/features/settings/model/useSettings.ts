import { useState, useCallback } from "react";
import type { SettingsContextType } from "./types";
import { useTheme } from "@/shared/theme/ThemeContext";

export const useSettings = (): SettingsContextType => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { mode, setMode } = useTheme();

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

  const toggleTheme = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light");
  }, [mode, setMode]);

  const getTheme = useCallback(() => {
    return mode;
  }, [mode]);

  return {
    isSettingsModalOpen,
    openSettingsModal,
    closeSettingsModal,
    clearAccountData,
    exportAccountData,
    importAccountData,
    toggleTheme,
    getTheme,
  };
};
