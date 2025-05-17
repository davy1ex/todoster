import { useState } from 'react';
import type { Task } from '@/entities/task';
import { Modal } from '@/shared/ui/Modal/Modal';
import './TaskEditModal.css';

interface TaskEditModalProps {
    isOpen: boolean;
    task: Task;
    onClose: () => void;
    onUpdateTask: (id: number, updates: Partial<Task>) => void;
    onChangeReward: (amount: number) => void;
    onCheckTask: (id: number) => void;
}

export const TaskEditModal = ({ 
    isOpen, 
    task, 
    onClose, 
    onUpdateTask, 
    onChangeReward,
    onCheckTask 
}: TaskEditModalProps) => {
    const [rewardAmount, setRewardAmount] = useState(0);

    if (!isOpen || !task) return null;

    const handleUpdate = (field: keyof Task, value: any) => {
        if (field === 'isDone') {
            // Use onCheckTask for task completion to properly handle rewards
            onCheckTask(task.id);
        } else {
            onUpdateTask(task.id, { [field]: value });
        }
    };

    const handleRewardChange = () => {
        if (rewardAmount > 0) {
            onChangeReward(rewardAmount);
            onUpdateTask(task.id, { reward: rewardAmount });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={"Edit task"}>
            <div className="taskEdit">
                <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    className="taskEdit__title"
                    placeholder="Task title"
                />

                <textarea
                    value={task.description}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    placeholder="Task description..."
                    className="taskEdit__description"
                    rows={3}
                />
                
                <div className="taskEdit__reward">
                    <span>Current reward: {task.reward} coins</span>
                    <div className="taskEdit__rewardInput">
                        <input
                            type="number"
                            value={task.reward || ''}
                            onChange={(e) => setRewardAmount(Math.max(0, Number(e.target.value)))}
                            min="0"
                            placeholder="Enter coins"
                        />
                        <button 
                            onClick={handleRewardChange}
                            disabled={rewardAmount <= 0}
                        >
                            Set coins
                        </button>
                    </div>
                </div>

                <div className="taskEdit__controls">
                    <div className="taskEdit__status">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={task.isDone}
                                onChange={(e) => handleUpdate('isDone', e.target.checked)}
                            />
                            <span>Completed</span>
                        </label>
                    </div>

                    <div className="taskEdit__list">
                        <select
                            value={task.list}
                            onChange={(e) => handleUpdate('list', e.target.value)}
                        >
                            <option value="Inbox">Inbox</option>
                            <option value="Backlog">Backlog</option>
                        </select>
                    </div>

                    {task.list === "Backlog" && (
                        <div className="taskEdit__dateBox">
                            <select
                                value={task.date_box}
                                onChange={(e) => handleUpdate('date_box', e.target.value)}
                            >
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="later">Later</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}; 