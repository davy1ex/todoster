import { useState } from "react";
import { useTaskCreation } from "./store";

export const useTaskInput = (listName: string) => {
  const [task, setTask] = useState("");
  const { createTask } = useTaskCreation();

  const handleAddTask = () => {
    if (!task.trim()) return;

    createTask({
      title: task.trim(),
      list: listName,
    });
    setTask("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && task.trim()) {
      handleAddTask();
    }
  };

  return {
    task,
    setTask,
    handleAddTask,
    handleKeyDown,
  };
};
