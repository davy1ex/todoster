import { useState } from "react";
import { useTaskCreation } from "../model/useTaskCreation";
import type { DateBox } from "@/entities/task/model/type";
import "./TaskInput.css";

interface TaskInputProps {
    listName: string;
    dateBox?: DateBox;
}

export const TaskInput = ({ listName, dateBox = "later" }: TaskInputProps) => {
    const [task, setTask] = useState("");
    const { createTask } = useTaskCreation();

    const handleAddTask = () => {
        if (!task.trim()) return;
        createTask({
            title: task.trim(),
            list: listName,
            date_box: dateBox,
        });
        setTask("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddTask();
        }
    };

    return (
        <div className="taskInput">
            <input 
                type="text" 
                placeholder={`Add a task to ${listName}`} 
                value={task} 
                onChange={(e) => setTask(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={handleAddTask}>+</button>
        </div>
    );
}; 