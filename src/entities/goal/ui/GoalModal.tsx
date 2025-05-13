import { FC, useEffect, useState } from 'react';
import type { Goal } from '../model/types';
import { projectStore } from '@/entities/project';
import './GoalModal.css';

interface GoalModalProps {
    goal?: Goal;
    onClose: () => void;
    onSave: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const GoalModal: FC<GoalModalProps> = ({ goal, onClose, onSave }) => {
    const [title, setTitle] = useState(goal?.title || '');
    const [description, setDescription] = useState(goal?.description || '');
    const [priority, setPriority] = useState<Goal['priority']>(goal?.priority || 'medium');
    const [projectId, setProjectId] = useState<number | undefined>(goal?.projectId);
    const [deadline, setDeadline] = useState<string>(
        goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
    );

    const { projects } = projectStore();

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            description,
            priority,
            projectId,
            isCompleted: goal?.isCompleted || false,
            deadline: deadline ? new Date(deadline) : undefined,
        });
        onClose();
    };

    return (
        <div className="goal-modal">
            <div className="goal-modal__content">
                <div className="goal-modal__header">
                    <h2>{goal ? 'Edit Goal' : 'New Goal'}</h2>
                    <button onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="goal-modal__field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            className="goal-modal__field-input"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="goal-modal__field">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="goal-modal__field-input"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="goal-modal__field">
                        <label htmlFor="priority">Priority</label>
                        <select
                            className="goal-modal__field-input"
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Goal['priority'])}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="goal-modal__field">
                        <label htmlFor="project">Project (Optional)</label>
                        <select
                            className="goal-modal__field-input"
                            id="project"
                            value={projectId || ''}
                            onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                        >
                            <option value="">No Project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="goal-modal__field">
                        <label htmlFor="deadline">Deadline (Optional)</label>
                        <input
                            className="goal-modal__field-input"
                            id="deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    <div className="goal-modal__actions">
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            {goal ? 'Save Changes' : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 