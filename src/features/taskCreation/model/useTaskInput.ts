import { useState } from "react";
import { useTaskCreation } from "./store";
import type { DateBox } from "@/entities/task/model/type";

export const useTaskInput = (listName: string) => {
  const [task, setTask] = useState("");
  const { createTask } = useTaskCreation();

  const handleAddTask = (date_box?: DateBox) => {
    if (!task.trim()) return;

    createTask({
      title: task.trim(),
      list: listName,
      date_box: date_box || "later",
    });
    setTask("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, date_box?: DateBox) => {
    if (event.key === "Enter" && task.trim()) {
      handleAddTask(date_box);
    }
  };

  return {
    task,
    setTask,
    handleAddTask,
    handleKeyDown,
  };
};
