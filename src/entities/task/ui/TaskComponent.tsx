import type { Task } from "../model/type"
import "./TaskComponent.css"

type TaskComponentProps = {
    task: Task
    listName: string
    onCheckTask: (id: number) => void
    handleClick: () => void
}

export const TaskComponent = (props: TaskComponentProps) => {
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onCheckTask(props.task.id);
    }

    return (
        <div className="taskComponent" onClick={props.handleClick}>
            {props.listName !== "Inbox" && (
                <div className="taskComponent__completed" onClick={handleCheckboxClick}>
                    <input 
                        type="checkbox" 
                        checked={props.task.isDone} 
                        onChange={handleCheckboxChange}
                    />
                </div>
            )}
            <div className="taskComponent__title">{props.task.title}</div>
            {props.listName !== "Inbox" && (
            <div className="taskComponent__reward">
                <svg 
                    className="reward-card__coin-icon"
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle 
                        cx="12" 
                        cy="12" 
                        r="8" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    />
                    <path 
                        d="M12 7V17M9 10L12 7L15 10" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                    />
                </svg>
                {props.task.reward} 
            </div>
        )}
        </div>
    )
}