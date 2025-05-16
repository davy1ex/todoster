import { useState, useEffect, useCallback } from "react";
import type { Task } from "@/entities/task";

interface UseTaskEditModalProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
  onChangeReward: (amount: number) => void;
}

export const useTaskEditModal = ({
  task,
  onClose,
  onUpdateTask,
  onChangeReward,
}: UseTaskEditModalProps) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  const handleInputChange = useCallback(
    (field: keyof Task, value: any) => {
      setEditedTask((prev) => ({
        ...prev,
        [field]: value,
      }));
      onUpdateTask(task.id, { [field]: value });
    },
    [task.id, onUpdateTask],
  );

  const handleRewardChange = useCallback(() => {
    if (rewardAmount) {
      onChangeReward(rewardAmount);
      setEditedTask(prev => ({
        ...prev,
        reward: rewardAmount
      }));
    }
  }, [rewardAmount, onChangeReward]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  return {
    editedTask,
    rewardAmount,
    setRewardAmount,
    handleInputChange,
    handleRewardChange,
    handleBackdropClick,
  };
};
