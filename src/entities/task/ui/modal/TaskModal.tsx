import type { Task } from '../../model/type'
import './TaskModal.css'
import { useState, useEffect } from 'react'

interface TaskModalProps {
    task: Task
    onChangeReward: (amount: number) => void
    onClose: () => void
    onUpdateTask: (id: number, updates: Partial<Task>) => void
}

export const TaskModal = ({ task, onChangeReward, onClose, onUpdateTask }: TaskModalProps) => {
    const [rewardAmount, setRewardAmount] = useState(0)
    const [editedTask, setEditedTask] = useState<Task>(task)

    useEffect(() => {
        setEditedTask(task)
    }, [task])

    const handleRewardChange = () => {
        if (rewardAmount) {
            onChangeReward(rewardAmount)
            setRewardAmount(0)
        }
    }

    const handleInputChange = (field: keyof Task, value: any) => {
        setEditedTask(prev => ({
            ...prev,
            [field]: value
        }))
        onUpdateTask(task.id, { [field]: value })
    }

    return (
        <div className="taskModal">
            <div className="taskModal__content">
                <div className="taskModal__header">
                    <input
                        type="text"
                        value={editedTask.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="taskModal__titleInput"
                    />
                    <button 
                        onClick={onClose}
                        className="taskModal__closeButton"
                    >
                        ×
                    </button>
                </div>

                <textarea
                    value={editedTask.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Task description..."
                    className="taskModal__description"
                    rows={3}
                />
                
                <div className="taskModal__reward">
                    <span>Current reward: {editedTask.reward} coins</span>
                    <div className="taskModal__rewardInput">
                        <input
                            type="number"
                            value={rewardAmount}
                            onChange={(e) => setRewardAmount(Number(e.target.value))}
                            min="0"
                            placeholder="Enter coins"
                            className="taskModal__rewardNumber"
                        />
                        <button 
                            onClick={handleRewardChange}
                            className="taskModal__rewardButton"
                            disabled={!rewardAmount}
                        >
                            Add coins
                        </button>
                    </div>
                </div>

                <div className="taskModal__controls">
                    <div className="taskModal__status">
                        <label>
                            <input
                                type="checkbox"
                                checked={editedTask.completed}
                                onChange={(e) => handleInputChange('completed', e.target.checked)}
                            />
                            Completed
                        </label>
                    </div>

                    <div className="taskModal__list">
                        <select
                            value={editedTask.list}
                            onChange={(e) => handleInputChange('list', e.target.value)}
                            className="taskModal__listSelect"
                        >
                            <option value="Inbox">Inbox</option>
                            <option value="Backlog">Backlog</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}