import { FC, useState, useCallback } from 'react';
import { ProjectCard } from '../ProjectCard';
import { ProjectModal } from '../ProjectModal';
import { projectStore } from '../../model/store';
import type { Project, ProjectStatus } from '../../model/types';
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
        const title = prompt('Enter project title:');
        if (title) {
            addProject(title, '');
        }
    }, [addProject]);

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

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
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