import { useState } from "react";
import { useTaskCreation } from "../model/useTaskCreation";
import type { DateBox, ImportanceLevel, UrgencyLevel } from "@/entities/task/model/type";
import "./TaskInput.css";

interface TaskInputProps {
    listName: string;
    dateBox?: DateBox;
    urgent?: UrgencyLevel;
    important?: ImportanceLevel;
}

export const TaskInput = ({ listName, dateBox = "later", urgent, important }: TaskInputProps) => {
    const [task, setTask] = useState("");
    const [points, setPoints] = useState<number>(10); // Default points value
    const { createTask } = useTaskCreation();

    const handleAddTask = () => {
        if (!task.trim()) return;
        createTask({
            title: task.trim(),
            list: listName,
            date_box: dateBox,
            reward: points,
            urgent: urgent,
            important: important,
        });
        setTask("");
        setPoints(10); // Reset to default
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAddTask();
        }
    };

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 0) {
            setPoints(value);
        }
    };

    return (
        <div className="taskInput" data-testid="task-input">
            <div className="taskInput__main">
                <input 
                    type="text" 
                    className="taskInput__title"
                    placeholder={`Add a task to ${listName}`} 
                    value={task} 
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={handleKeyDown}
                    data-testid="task-title-input"
                />
                <div className="taskInput__points">
                    <input
                        type="number"
                        className="taskInput__points-input"
                        value={points}
                        onChange={handlePointsChange}
                        min="0"
                        placeholder="Points"
                        data-testid="task-points-input"
                    />
                    <span className="taskInput__points-label">pts</span>
                </div>
                <button 
                    onClick={handleAddTask}
                    className="taskInput__add-button"
                    data-testid="add-task-button"
                >
                    +
                </button>
            </div>
        </div>
    );
}; 