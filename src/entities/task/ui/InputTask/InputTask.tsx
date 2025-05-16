import { useTaskInput } from "@/features/taskCreation";
import "./InputTask.css";

interface InputTaskProps {
    listName: string;
}

export const InputTask = ({ listName }: InputTaskProps) => {
    const { task, setTask, handleAddTask, handleKeyDown } = useTaskInput(listName);

    return (
        <div className="inputTask">
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