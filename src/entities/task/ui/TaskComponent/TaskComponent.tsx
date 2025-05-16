import { FC } from 'react';
import type { Task } from "@/entities/task/model/type"
import "./TaskComponent.css"
import { taskStore } from "@/entities/task/model/store"
import { CoinIcon } from '@/shared/ui/icons';

interface TaskComponentProps {
    task: Task
    listName: string
    onCheckTask: (id: number) => void
    handleClick: () => void
}

export const TaskComponent: FC<TaskComponentProps> = ({
    task,
    listName,
    onCheckTask,
    handleClick,
}) => {
    const { archiveTask } = taskStore();

    const handleArchive = (e: React.MouseEvent) => {
        e.stopPropagation();
        archiveTask(task.id);
    };

    return (
        <div className={`taskComponent ${task.isDone ? 'taskComponent--done' : ''}`}>
            <div className="taskComponent__main" onClick={handleClick}>
                <input 
                    type="checkbox" 
                    checked={task.isDone} 
                    onChange={() => onCheckTask(task.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="taskComponent__checkbox"
                />
                <div className="taskComponent__content">
                    <div className="taskComponent__title">{task.title}</div>
                    {task.description && (
                        <div className="taskComponent__description">{task.description}</div>
                    )}
                </div>
            </div>
            <div className="taskComponent__actions">
                {listName !== "Inbox" && (
                    <div className="taskComponent__reward">
                        <CoinIcon className="reward-card__coin-icon" />
                        {task.reward} 
                    </div>
                )}
                <button
                    className="taskComponent__archive-btn"
                    onClick={handleArchive}
                    title="Archive task"
                >
                    📦
                </button>
            </div>
        </div>
    );
}