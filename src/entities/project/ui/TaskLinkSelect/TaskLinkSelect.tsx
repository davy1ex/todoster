import { FC, useState } from 'react';
import { Task } from '@/entities/task';
import './TaskLinkSelect.css';

interface TaskLinkSelectProps {
    tasks: Task[];
    linkedTaskIds: number[];
    onLinkTask: (taskId: number) => void;
    onUnlinkTask: (taskId: number) => void;
}

export const TaskLinkSelect: FC<TaskLinkSelectProps> = ({
    tasks,
    linkedTaskIds,
    onLinkTask,
    onUnlinkTask,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleTaskClick = (taskId: number) => {
        const isLinked = linkedTaskIds.includes(taskId);
        if (isLinked) {
            onUnlinkTask(taskId);
        } else {
            onLinkTask(taskId);
        }
    };

    return (
        <div className="task-link-select">
            <button 
                className="task-link-select__trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                Link existing task...
            </button>
            
            {isOpen && (
                <div className="task-link-select__dropdown">
                    {tasks.map((task) => {
                        const isLinked = linkedTaskIds.includes(task.id);
                        return (
                            <div 
                                key={task.id}
                                className={`task-link-select__item ${isLinked ? 'is-linked' : ''}`}
                                onClick={() => handleTaskClick(task.id)}
                            >
                                <span className="task-link-select__item-title">
                                    {task.title}
                                </span>
                                <span className="task-link-select__item-status">
                                    {isLinked ? '✓ Linked' : 'Link'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}; 