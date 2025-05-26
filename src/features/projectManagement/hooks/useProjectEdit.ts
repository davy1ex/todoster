import { useState, useCallback, useEffect } from 'react';
import { Project, ProjectStatus } from '@/entities/project';
import { projectStore } from '@/entities/project';
import { taskStore } from '@/entities/task';

export const useProjectEdit = (initialProject: Project) => {
    // Get latest project data from store
    const project = projectStore((state) => state.getProjectById(initialProject.id)) || initialProject;
    const tasks = taskStore((state) => state.tasks);

    // Local state
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDescription, setEditingDescription] = useState(false);
    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);

    // Update local state when project changes
    useEffect(() => {
        setTitle(project.title);
        setDescription(project.description);
    }, [project]);

    // Handlers
    const handleUpdateTitle = useCallback(
        (newTitle: string, onUpdateProject: (id: number, updates: Partial<Project>) => void) => {
            if (newTitle.trim()) {
                setTitle(newTitle);
                onUpdateProject(project.id, { title: newTitle });
            }
            setEditingTitle(false);
        },
        [project.id]
    );

    const handleUpdateDescription = useCallback(
        (newDescription: string, onUpdateProject: (id: number, updates: Partial<Project>) => void) => {
            setDescription(newDescription);
            onUpdateProject(project.id, { description: newDescription });
            setEditingDescription(false);
        },
        [project.id]
    );

    const handleUpdateStatus = useCallback(
        (status: ProjectStatus, onUpdateStatus: (projectId: number, status: ProjectStatus) => void) => {
            onUpdateStatus(project.id, status);
        },
        [project.id]
    );

    const linkedTasks = tasks.filter(task => project.linkedTaskIds.includes(task.id));

    return {
        // State
        project,
        tasks,
        title,
        description,
        editingTitle,
        editingDescription,
        linkedTasks,

        // Setters
        setTitle,
        setDescription,
        setEditingTitle,
        setEditingDescription,

        // Handlers
        handleUpdateTitle,
        handleUpdateDescription,
        handleUpdateStatus,
    };
}; 