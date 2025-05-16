import { FC } from 'react';
import { Project, ProjectStatus } from '@/entities/project';
import { Modal } from '@/shared/ui/Modal/Modal';
import { TaskInput } from '@/features/taskCreation';
import { TaskLinkSelect } from '@/entities/project/ui/TaskLinkSelect';
import { LinkedTasksList } from '@/entities/project/ui/LinkedTasksList';
import { useProjectEdit } from '../hooks/useProjectEdit';
import { taskStore } from '@/entities/task';
import './ProjectEditModal.css';

interface ProjectEditModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    onUpdateProject: (id: number, updates: Partial<Project>) => void;
    onUpdateStatus: (projectId: number, status: ProjectStatus) => void;
    onLinkTask: (projectId: number, taskId: number) => void;
    onUnlinkTask: (projectId: number, taskId: number) => void;
}

export const ProjectEditModal: FC<ProjectEditModalProps> = ({
    project: initialProject,
    isOpen,
    onClose,
    onUpdateProject,
    onUpdateStatus,
    onLinkTask,
    onUnlinkTask
}) => {
    const {
        project,
        tasks,
        title,
        description,
        editingTitle,
        editingDescription,
        linkedTasks,
        setTitle,
        setDescription,
        setEditingTitle,
        setEditingDescription,
        handleUpdateTitle,
        handleUpdateDescription,
        handleUpdateStatus,
    } = useProjectEdit(initialProject);

    const { checkTask, updateTask } = taskStore();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Project">
            <div className="project-edit-modal">
                <div className="project-edit-modal__content">
                    <div className="project-edit-modal__header">
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
                                className="project-edit-modal__title-input"
                            />
                        ) : (
                            <h2 onClick={() => setEditingTitle(true)}>{title}</h2>
                        )}
                    </div>

                    <div className="project-edit-modal__section">
                        <h3>Status</h3>
                        <select 
                            className="project-edit-modal__status-select"
                            value={project.status}
                            onChange={(e) => handleUpdateStatus(e.target.value as ProjectStatus, onUpdateStatus)}
                        >
                            <option value="not_started">Not Started</option>
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <div className="project-edit-modal__section">
                        <h3>Description</h3>
                        {editingDescription ? (
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={(e) => handleUpdateDescription(e.target.value, onUpdateProject)}
                                autoFocus
                                className="project-edit-modal__description-input"
                            />
                        ) : (
                            <div 
                                onClick={() => setEditingDescription(true)}
                                className="project-edit-modal__editable-text"
                            >
                                <p>{description || 'Click to add description'}</p>
                            </div>
                        )}
                    </div>

                    <div className="project-edit-modal__section">
                        <h3>Linked Tasks</h3>
                        <LinkedTasksList
                            tasks={linkedTasks}
                            onCheckTask={checkTask}
                            onUpdateTask={updateTask}
                            onUnlinkTask={(taskId) => onUnlinkTask(project.id, taskId)}
                        />

                        <div className="project-edit-modal__add-task">
                            <h4>Add Task</h4>
                            <TaskInput listName="Backlog"/>

                            <TaskLinkSelect
                                tasks={tasks}
                                linkedTaskIds={project.linkedTaskIds}
                                onLinkTask={(taskId) => onLinkTask(project.id, taskId)}
                                onUnlinkTask={(taskId) => onUnlinkTask(project.id, taskId)}
                            />
                        </div>
                    </div>

                    <div className="project-edit-modal__section">
                        <h3>Metadata</h3>
                        <div className="project-edit-modal__metadata">
                            <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                            <p>Last Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                            <p>Linked Tasks: {project.linkedTaskIds.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}; 