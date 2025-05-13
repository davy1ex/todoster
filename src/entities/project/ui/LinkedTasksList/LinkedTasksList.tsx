import { FC, useState } from 'react';
import { Task, TaskComponent } from '@/entities/task';
import './LinkedTasksList.css';

interface LinkedTasksListProps {
    tasks: Task[];
    onCheckTask: (taskId: number) => void;
    onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
    onUnlinkTask: (taskId: number) => void;
}

export const LinkedTasksList: FC<LinkedTasksListProps> = ({
    tasks,
    onCheckTask,
    onUpdateTask,
    onUnlinkTask,
}) => {
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

    const handleTaskClick = (task: Task) => {
        setEditingTaskId(task.id);
    };

    const handleTaskTitleUpdate = (taskId: number, newTitle: string) => {
        if (newTitle.trim()) {
            onUpdateTask(taskId, { title: newTitle });
        }
        setEditingTaskId(null);
    };

    return (
        <div className="linked-tasks-list">
            {tasks.map((task) => (
                <div key={task.id} className="linked-tasks-list__item">
                    {editingTaskId === task.id ? (
                        <input
                            type="text"
                            defaultValue={task.title}
                            onBlur={(e) => handleTaskTitleUpdate(task.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleTaskTitleUpdate(task.id, e.currentTarget.value);
                                }
                            }}
                            autoFocus
                            className="linked-tasks-list__title-input"
                        />
                    ) : (
                        <TaskComponent
                            task={task}
                            onCheckTask={onCheckTask}
                            handleClick={() => handleTaskClick(task)}
                        />
                    )}
                    <button 
                        onClick={() => onUnlinkTask(task.id)}
                        className="linked-tasks-list__unlink-btn"
                    >
                        Unlink
                    </button>
                </div>
            ))}
        </div>
    );
}; 