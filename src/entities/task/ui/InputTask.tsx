import { useState } from "react";
import "./InputTask.css";

type InputTaskProps = {
    onAdd: (task: string) => void;
    listName: string;
}

export const InputTask = (props: InputTaskProps) => {
    const [task, setTask] = useState("");
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            console.log("Enter key pressed");
            props.onAdd(task);
            setTask("");
        }
    }
    const handleAddTask = () => {
        props.onAdd(task);
        setTask("");
    }
    return (
        <div className="inputTask">
            <input type="text" placeholder={`Add a task to ${props.listName}`} onKeyDown={handleKeyDown} value={task} onChange={(e) => setTask(e.target.value)}/>
            <button onClick={() => handleAddTask()}>+</button>
        </div>
    )
}