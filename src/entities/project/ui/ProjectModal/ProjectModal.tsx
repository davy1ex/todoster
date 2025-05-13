import { FC, useRef, useEffect, useMemo, useCallback } from 'react';
import { Project, ProjectStatus } from '../../model/types';
import { InputTask } from '@/entities/task';
import { TaskLinkSelect } from '../TaskLinkSelect';
import { LinkedTasksList } from '../LinkedTasksList';
import { useProjectModal } from '../../hooks/useProjectModal';
import { goalStore } from '../../../goal/model/store';
import type { Goal } from '../../../goal/model/types';
import './ProjectModal.css';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    onUpdateProject: (id: number, updates: Partial<Project>) => void;
    onUpdateStatus: (projectId: number, status: ProjectStatus) => void;
    onLinkTask: (projectId: number, taskId: number) => void;
    onUnlinkTask: (projectId: number, taskId: number) => void;
}

export const ProjectModal: FC<ProjectModalProps> = ({
    project: initialProject,
    onClose,
    onUpdateProject,
    onUpdateStatus,
    onLinkTask,
    onUnlinkTask
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    const {
        project,
        tasks,
        title,
        description,
        editingTitle,
        editingDescription,
        newGoalTitle,
        newGoalDescription,
        setTitle,
        setDescription,
        setEditingTitle,
        setEditingDescription,
        setNewGoalTitle,
        setNewGoalDescription,
        checkTask,
        updateTask,
        handleUpdateTitle,
        handleUpdateDescription,
        handleAddNewTask,
        handleAddGoal,
    } = useProjectModal(initialProject);

    // Memoize goals selector
    const goals = useMemo(() => 
        goalStore.getState().getGoalsByProjectId(project.id),
        [project.id]
    );

    // Memoize goal actions
    const goalActions = useMemo(() => ({
        addGoalToProject: goalStore.getState().addGoalToProject,
        deleteGoal: goalStore.getState().deleteGoal,
        updateGoal: goalStore.getState().updateGoal
    }), []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        // Handle ESC key
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    const linkedTasks = useMemo(() => 
        tasks.filter(task => project.linkedTaskIds.includes(task.id)),
        [tasks, project.linkedTaskIds]
    );

    return (
        <div className="project-modal">
            <div className="project-modal__content" ref={modalRef}>
                <div className="project-modal__header">
                    {editingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={(e) => handleUpdateTitle(e.target.value, onUpdateProject)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleUpdateTitle(e.currentTarget.value, onUpdateProject);
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <h2 onClick={() => setEditingTitle(true)}>{title}</h2>
                    )}
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="project-modal__body">
                    <div className="project-modal__section">
                        <h3>Status</h3>
                        <select 
                            value={project.status}
                            onChange={(e) => onUpdateStatus(project.id, e.target.value as ProjectStatus)}
                        >
                            <option value="not_started">Not Started</option>
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="project-modal__section">
                        <h3>Description</h3>
                        {editingDescription ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={(e) => handleUpdateDescription(e.target.value, onUpdateProject)}
                                autoFocus
                            />
                        ) : (
                            <div 
                                onClick={() => setEditingDescription(true)}
                                className="project-modal__editable-text"
                            >
                                <p>{description || 'Click to add description'}</p>
                            </div>
                        )}
                    </div>

                    <div className="project-modal__section">
                        <h3>Linked Tasks</h3>
                        <LinkedTasksList
                            tasks={linkedTasks}
                            onCheckTask={checkTask}
                            onUpdateTask={updateTask}
                            onUnlinkTask={(taskId) => onUnlinkTask(project.id, taskId)}
                        />

                        <div className="project-modal__add-task">
                            <h4>Add Task</h4>
                            <InputTask
                                onAdd={(taskTitle) => handleAddNewTask(taskTitle, onLinkTask)}
                                listName={title}
                            />
                            <TaskLinkSelect
                                tasks={tasks}
                                linkedTaskIds={project.linkedTaskIds}
                                onLinkTask={(taskId) => onLinkTask(project.id, taskId)}
                                onUnlinkTask={(taskId) => onUnlinkTask(project.id, taskId)}
                            />
                        </div>
                    </div>

                    <div className="project-modal__section">
                        <h3>Goals</h3>
                        <div className="project-modal__goals-list">
                            {goals.map((goal) => (
                                <div key={goal.id} className="project-modal__goal">
                                    <div>
                                        <h4>{goal.title}</h4>
                                        <p>{goal.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => goalActions.deleteGoal(goal.id)}
                                        className="project-modal__goal-remove"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="project-modal__add-goal">
                            <input
                                type="text"
                                placeholder="New goal title"
                                value={newGoalTitle}
                                onChange={(e) => setNewGoalTitle(e.target.value)}
                            />
                            <textarea
                                placeholder="Goal description (optional)"
                                value={newGoalDescription}
                                onChange={(e) => setNewGoalDescription(e.target.value)}
                            />
                            <button onClick={() => handleAddGoal(goalActions.addGoalToProject)}>Add Goal</button>
                        </div>
                    </div>

                    <div className="project-modal__section">
                        <h3>Metadata</h3>
                        <div className="project-modal__metadata">
                            <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                            <p>Last Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                            <p>Linked Tasks: {project.linkedTaskIds.length}</p>
                            <p>Goals: {project.goalIds.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};