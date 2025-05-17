import { FC } from 'react';
import type { ProjectStatus } from '@/entities/project/model/types';
import './ProjectStatusFilter.css';

interface ProjectStatusFilterProps {
    currentStatus?: ProjectStatus;
    onStatusChange: (status?: ProjectStatus) => void;
}

export const ProjectStatusFilter: FC<ProjectStatusFilterProps> = ({
    currentStatus,
    onStatusChange
}) => {
    const statuses: { label: string; value?: ProjectStatus }[] = [
        { label: 'All', value: undefined },
        { label: 'Not Started', value: 'not_started' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' }
    ];

    return (
        <div className="project-status-filter" data-testid="project-status-filter">
            {statuses.map(({ label, value }) => (
                <button
                    key={label}
                    className={`project-status-filter__button ${currentStatus === value ? 'project-status-filter__button--active' : ''}`}
                    onClick={() => onStatusChange(value)}
                    data-testid={`project-status-${value || 'all'}`}
                >
                    {label}
                    <span className="project-status-filter__count" data-testid={`project-status-${value || 'all'}-count`}>
                        {/* Count will be added later */}
                    </span>
                </button>
            ))}
        </div>
    );
}; 