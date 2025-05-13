import { useState } from 'react';
import { goalStore } from '../model/store';
import { GoalModal } from './GoalModal';
import type { Goal } from '../model/types';
import './GoalList.css';

export const GoalList = () => {
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { goals, addGoal, updateGoal, deleteGoal, toggleGoalCompletion } = goalStore();

    const handleOpenModal = (goal?: Goal) => {
        setSelectedGoal(goal || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedGoal(null);
        setIsModalOpen(false);
    };

    const handleSave = (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (selectedGoal) {
            updateGoal(selectedGoal.id, goalData);
        } else {
            addGoal(goalData);
        }
    };

    const getPriorityColor = (priority: Goal['priority']) => {
        switch (priority) {
            case 'high':
                return '#ef5350';
            case 'medium':
                return '#ffa726';
            case 'low':
                return '#66bb6a';
            default:
                return '#757575';
        }
    };

    return (
        <div className="goal-list">
            <div className="goal-list__header">
                <h2>Goals</h2>
                <button onClick={() => handleOpenModal()}>Add Goal</button>
            </div>

            <div className="goal-list__content">
                {goals.map((goal) => (
                    <div
                        key={goal.id}
                        className={`goal-list__item ${goal.isCompleted ? 'completed' : ''}`}
                    >
                        <div className="goal-list__item-header">
                            <div className="goal-list__item-title">
                                <input
                                    type="checkbox"
                                    checked={goal.isCompleted}
                                    onChange={() => toggleGoalCompletion(goal.id)}
                                />
                                <span>{goal.title}</span>
                            </div>
                            <div 
                                className="goal-list__item-priority"
                                style={{ backgroundColor: getPriorityColor(goal.priority) }}
                            >
                                {goal.priority}
                            </div>
                        </div>

                        {goal.description && (
                            <p className="goal-list__item-description">{goal.description}</p>
                        )}

                        <div className="goal-list__item-footer">
                            {goal.deadline && (
                                <span className="goal-list__item-deadline">
                                    Due: {new Date(goal.deadline).toLocaleDateString()}
                                </span>
                            )}
                            <div className="goal-list__item-actions">
                                <button onClick={() => handleOpenModal(goal)}>Edit</button>
                                <button onClick={() => deleteGoal(goal.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <GoalModal
                    goal={selectedGoal || undefined}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}; 