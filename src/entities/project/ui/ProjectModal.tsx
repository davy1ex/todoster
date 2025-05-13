import { FC, useState, useCallback, useEffect, useRef } from 'react';
import { Project, Goal, ProjectStatus } from '../model/types';
import { taskStore, TaskComponent, InputTask } from '@/entities/task';
import { projectStore } from '../model/store';
import type { Task } from '@/entities/task';
import './ProjectModal.css';

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
    onUpdateProject: (id: number, updates: Partial<Project>) => void;
    onAddGoal: (projectId: number, title: string, description?: string) => void;
    onUpdateGoal: (projectId: number, goalId: number, updates: Partial<Goal>) => void;
    onRemoveGoal: (projectId: number, goalId: number) => void;
    onUpdateStatus: (projectId: number, status: ProjectStatus) => void;
    onLinkTask: (projectId: number, taskId: number) => void;
    onUnlinkTask: (projectId: number, taskId: number) => void;
}

export const ProjectModal: FC<ProjectModalProps> = ({
    project: initialProject,
    onClose,
    onUpdateProject,
    onAddGoal,
    onUpdateGoal,
    onRemoveGoal,
    onUpdateStatus,
    onLinkTask,
    onUnlinkTask
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [newGoalTitle, setNewGoalTitle] = useState('');
    const [newGoalDescription, setNewGoalDescription] = useState('');
    const [editingDescription, setEditingDescription] = useState(false);
    const [editingTitle, setEditingTitle] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    
    // Get the latest project data from the store
    const project = projectStore(state => 
        state.getProjectById(initialProject.id)
    ) || initialProject;

    // Subscribe to tasks from the store
    const tasks = taskStore(state => state.tasks);
    const addTask = taskStore(state => state.addTask);
    const checkTask = taskStore(state => state.checkTask);
    const updateTask = taskStore(state => state.updateTask);

    // Local state for edited fields
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);

    // Update local state when project changes
    useEffect(() => {
        setTitle(project.title);
        setDescription(project.description);
    }, [project]);

    // Compute linked and unlinked tasks based on latest project and task data
    const linkedTasks = tasks.filter(task => 
        project.linkedTaskIds.map(id => Number(id)).includes(task.id)
    );
    
    const unlinkedTasks = tasks.filter(task => 
        !project.linkedTaskIds.map(id => Number(id)).includes(task.id)
    );

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

    const handleAddGoal = useCallback(() => {
        if (newGoalTitle.trim()) {
            onAddGoal(project.id, newGoalTitle, newGoalDescription);
            setNewGoalTitle('');
            setNewGoalDescription('');
        }
    }, [newGoalTitle, newGoalDescription, project.id, onAddGoal]);

    const handleUpdateDescription = useCallback((newDescription: string) => {
        setDescription(newDescription);
        onUpdateProject(project.id, { description: newDescription });
        setEditingDescription(false);
    }, [project.id, onUpdateProject]);

    const handleUpdateTitle = useCallback((newTitle: string) => {
        if (newTitle.trim()) {
            setTitle(newTitle);
            onUpdateProject(project.id, { title: newTitle });
        }
        setEditingTitle(false);
    }, [project.id, onUpdateProject]);

    const handleTaskSelection = useCallback((taskId: string) => {
        if (taskId) {
            onLinkTask(project.id, Number(taskId));
            setSelectedTaskId('');
        }
    }, [project.id, onLinkTask]);

    const handleAddNewTask = useCallback((taskTitle: string) => {
        if (taskTitle.trim()) {
            const newTask: Task = {
                id: Date.now(),
                title: taskTitle,
                description: '',
                isDone: false,
                list: 'Backlog',
                reward: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            addTask(newTask);
            onLinkTask(project.id, newTask.id);
        }
    }, [project.id, addTask, onLinkTask]);

    const handleTaskClick = useCallback((task: Task) => {
        setEditingTaskId(task.id);
    }, []);

    const handleTaskTitleUpdate = useCallback((taskId: number, newTitle: string) => {
        if (newTitle.trim()) {
            updateTask(taskId, { title: newTitle });
        }
        setEditingTaskId(null);
    }, [updateTask]);

    return (
        <div className="project-modal">
            <div className="project-modal__content" ref={modalRef}>
                <div className="project-modal__header">
                    {editingTitle ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={(e) => handleUpdateTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleUpdateTitle(e.currentTarget.value);
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
                                onBlur={(e) => handleUpdateDescription(e.target.value)}
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
                        <div className="project-modal__tasks-list">
                            {linkedTasks.map((task) => (
                                <div key={task.id} className="project-modal__task">
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
                                            className="project-modal__task-title-input"
                                        />
                                    ) : (
                                        <TaskComponent
                                            task={task}
                                            onCheckTask={checkTask}
                                            handleClick={() => handleTaskClick(task)}
                                        />
                                    )}
                                    <button 
                                        onClick={() => onUnlinkTask(project.id, task.id)}
                                        className="project-modal__task-unlink"
                                    >
                                        Unlink
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="project-modal__add-task">
                            <h4>Add Task</h4>
                            <InputTask
                                onAdd={handleAddNewTask}
                                listName={title}
                            />
                            <select 
                                value={selectedTaskId}
                                onChange={(e) => handleTaskSelection(e.target.value)}
                                className="project-modal__task-select"
                            >
                                <option value="">Link existing task...</option>
                                {unlinkedTasks.map((task) => (
                                    <option key={task.id} value={task.id}>
                                        {task.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="project-modal__section">
                        <h3>Goals</h3>
                        <div className="project-modal__goals-list">
                            {project.goals.map((goal) => (
                                <div key={goal.id} className="project-modal__goal">
                                    <div>
                                        <h4>{goal.title}</h4>
                                        <p>{goal.description}</p>
                                    </div>
                                    <button 
                                        onClick={() => onRemoveGoal(project.id, goal.id)}
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
                            <button onClick={handleAddGoal}>Add Goal</button>
                        </div>
                    </div>

                    <div className="project-modal__section">
                        <h3>Metadata</h3>
                        <div className="project-modal__metadata">
                            <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
                            <p>Last Updated: {new Date(project.updatedAt).toLocaleString()}</p>
                            <p>Linked Tasks: {project.metadata.linkedTasksCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
}; 