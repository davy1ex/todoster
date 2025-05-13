import { FC } from 'react';
import type { Project } from '../../model/types';
import { goalStore } from '../../../goal/model/store';
import './ProjectCard.css';

interface ProjectCardProps {
    project: Project;
    onClick?: (project: Project) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, onClick }) => {
    const handleClick = () => {
        onClick?.(project);
    };

    const formatDate = (date: Date | string) => {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString();
    };

    return (
        <div 
            className={`project-card project-card--${project.status}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <div className="project-card__header">
                <h3 className="project-card__title">{project.title}</h3>
                <span className="project-card__status">{project.status}</span>
            </div>
            
            <div className="project-card__metadata">
                <span>Tasks: {project.metadata.linkedTasksCount}</span>
                <span>Goals: {project.goalIds.length}</span>
                <span>Created: {formatDate(project.createdAt)}</span>
            </div>
            
            <p className="project-card__description">
                {project.description.length > 100 
                    ? `${project.description.slice(0, 97)}...` 
                    : project.description}
            </p>
        </div>
    );
}; 