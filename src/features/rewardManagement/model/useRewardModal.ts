import { useState, useCallback, useRef } from 'react';
import type { Reward } from '@/entities/reward/model/types';
import { rewardStore } from '@/entities/reward/model/store';

export const useRewardModal = (reward: Reward) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState(reward.title);
    const [cost, setCost] = useState(reward.cost.toString());
    const deleteReward = rewardStore((state) => state.deleteReward);
    const updateReward = rewardStore((state) => state.updateReward);

    const handleSave = useCallback((onClose: () => void) => {
        if (title.trim() && Number(cost) > 0) {
            updateReward(reward.id, {
                title: title.trim(),
                cost: Number(cost),
            });
            onClose();
        }
    }, [title, cost, reward.id, updateReward]);

    const handleDelete = useCallback((onClose: () => void) => {
        deleteReward(reward.id);
        onClose();
    }, [reward.id, deleteReward]);

    return {
        // Refs
        modalRef,

        // State
        title,
        cost,

        // Setters
        setTitle,
        setCost,

        // Handlers
        handleSave,
        handleDelete,

        // Validation
        isValid: title.trim() && Number(cost) > 0
    };
}; 