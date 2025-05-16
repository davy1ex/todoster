import { useState, useCallback, useRef, useEffect } from 'react';
import type { Goal } from '@/entities/goal/model/types';
import { projectStore } from '@/entities/project';

export const useGoalModal = (initialGoal?: Goal) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState(initialGoal?.title || '');
    const [description, setDescription] = useState(initialGoal?.description || '');
    const [priority, setPriority] = useState<Goal['priority']>(initialGoal?.priority || 'medium');
    const [projectId, setProjectId] = useState<number | undefined>(initialGoal?.projectId);
    const [deadline, setDeadline] = useState<string>(
        initialGoal?.deadline ? new Date(initialGoal.deadline).toISOString().split('T')[0] : ''
    );

    const { projects } = projectStore();

    const handleSave = useCallback((
        onSave: (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void,
        onClose: () => void
    ) => {
        if (!title.trim()) return;

        onSave({
            title: title.trim(),
            description,
            priority,
            projectId,
            isCompleted: initialGoal?.isCompleted || false,
            deadline: deadline ? new Date(deadline) : undefined,
            isArchived: false
        });
        onClose();
    }, [title, description, priority, projectId, deadline, initialGoal?.isCompleted]);

    return {
        // Refs
        modalRef,

        // State
        title,
        description,
        priority,
        projectId,
        deadline,
        projects,

        // Setters
        setTitle,
        setDescription,
        setPriority,
        setProjectId,
        setDeadline,

        // Handlers
        handleSave
    };
}; 