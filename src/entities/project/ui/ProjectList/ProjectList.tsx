import { FC, useState, useCallback } from 'react';
import { ProjectCard } from '../ProjectCard';
import { projectStore } from '../../model/store';
import type { Project, ProjectStatus } from '../../model/types';
import { ProjectInput } from '@/features/project/ui/ProjectInput';
import { ProjectEditModal } from '@/features/projectManagement';
import './ProjectList.css';

interface ProjectListProps {
    title?: string;
    status?: ProjectStatus;
    hasLinkedTasks?: boolean;
}

export const ProjectList: FC<ProjectListProps> = ({ 
    title = "Projects",
    status,
    hasLinkedTasks 
}) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [showProjectInput, setShowProjectInput] = useState(false);
    const {
        projects,
        addProject,
        updateProject,
        updateProjectStatus,
        getFilteredProjects,
        linkTask,
        unlinkTask
    } = projectStore((state) => state);

    const filteredProjects = getFilteredProjects(status, hasLinkedTasks);

    const handleAddProject = useCallback(() => {
        setShowProjectInput(true);
    }, []);

    const handleProjectSubmit = useCallback((title: string) => {
        addProject(title);
        setShowProjectInput(false);
    }, [addProject]);

    const handleProjectInputCancel = useCallback(() => {
        setShowProjectInput(false);
    }, []);

    const handleProjectClick = useCallback((project: Project) => {
        setSelectedProject(project);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedProject(null);
    }, []);

    return (
        <div className="project-list">
            <div className="project-list__header">
                <h2>{title}</h2>
                <button onClick={handleAddProject}>Add Project</button>
            </div>

            <div className="project-list__content">
                {filteredProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={handleProjectClick}
                    />
                ))}
            </div>

            {showProjectInput && (
                <ProjectInput
                    onSubmit={handleProjectSubmit}
                    onCancel={handleProjectInputCancel}
                />
            )}

            {selectedProject && (
                <ProjectEditModal
                    project={selectedProject}
                    isOpen={true}
                    onClose={handleCloseModal}
                    onUpdateProject={updateProject}
                    onUpdateStatus={updateProjectStatus}
                    onLinkTask={linkTask}
                    onUnlinkTask={unlinkTask}
                />
            )}
        </div>
    );
}; 