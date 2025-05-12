import type { Task } from '@/entities/task'
import { useTaskEditModal } from '../model/useTaskEditModal'
import './TaskEditModal.css'

interface TaskEditModalProps {
    task: Task
    onClose: () => void
    onUpdateTask: (id: number, updates: Partial<Task>) => void
    onChangeReward: (amount: number) => void
}

export const TaskEditModal = (props: TaskEditModalProps) => {
    const {
        editedTask,
        rewardAmount,
        setRewardAmount,
        handleInputChange,
        handleRewardChange,
        handleBackdropClick
    } = useTaskEditModal(props)

    return (
        <div className="taskModal" onClick={handleBackdropClick}>
            <div className="taskModal__content">
                <div className="taskModal__header">
                    <input
                        type="text"
                        value={editedTask.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="taskModal__titleInput"
                    />
                    <button 
                        onClick={props.onClose}
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