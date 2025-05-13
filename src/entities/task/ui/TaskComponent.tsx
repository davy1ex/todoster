import type { Task } from "../model/type"
import "./TaskComponent.css"

type TaskComponentProps = {
    task: Task
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
            <div className="taskComponent__completed" onClick={handleCheckboxClick}>
                <input 
                    type="checkbox" 
                    checked={props.task.isDone} 
                    onChange={handleCheckboxChange}
                />
            </div>
            <div className="taskComponent__title">{props.task.title}</div>
            <div className="taskComponent__reward">{props.task.reward} coins</div>
        </div>
    )
}