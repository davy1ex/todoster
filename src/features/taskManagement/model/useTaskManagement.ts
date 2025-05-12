import { useState, useCallback } from "react";
import { Task, taskStore } from "@/entities/task";
import type { TaskManagementContextType } from "./types";

export const useTaskManagement = (): TaskManagementContextType => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { updateTask, changeReward, checkTask, tasks } = taskStore(
    (state) => state,
  );

  const openTaskModal = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const closeTaskModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  const handleTaskUpdate = useCallback(
    (id: number, updates: Partial<Task>) => {
      updateTask(id, updates);
    },
    [updateTask],
  );

  const handleRewardChange = useCallback(
    (amount: number) => {
      if (selectedTask) {
        changeReward(selectedTask.id, amount);
      }
    },
    [selectedTask, changeReward],
  );

  const handleTaskCheck = useCallback(
    (id: number) => {
      checkTask(id);
    },
    [checkTask],
  );

  return {
    selectedTask,
    isModalOpen,
    openTaskModal,
    closeTaskModal,
    handleTaskUpdate,
    handleRewardChange,
    handleTaskCheck,
  };
};
