import { FC, useState, KeyboardEvent, MouseEvent } from 'react';
import { rewardStore } from '@/entities/reward/model/store';
import { RewardCard } from '@/entities/reward/ui/RewardCard/RewardCard';
import { GenericList } from '@/shared/ui/GenericList';
import type { Reward } from '@/entities/reward/model/types';
import './RewardsList.css';

export const RewardsList: FC = () => {
    const rewards = rewardStore((state) => state.rewards);
    const addReward = rewardStore((state) => state.addReward);
    
    const [newRewardTitle, setNewRewardTitle] = useState('');
    const [isAddingReward, setIsAddingReward] = useState(false);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newRewardTitle.trim()) {
            addReward({
                title: newRewardTitle.trim(),
                cost: 10, // Default cost
                isArchived: false,
            });
            setNewRewardTitle('');
            setIsAddingReward(false);
        } else if (e.key === 'Escape') {
            setNewRewardTitle('');
            setIsAddingReward(false);
        }
    };

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setNewRewardTitle('');
            setIsAddingReward(false);
        }
    };

    const renderReward = (reward: Reward) => (
        <RewardCard key={reward.id} reward={reward} />
    );

    return (
        <div className="rewards-list">
            <GenericList
                title="Rewards"
                items={rewards}
                onAdd={() => setIsAddingReward(true)}
                renderItem={renderReward}
                addButtonText="Add Reward"
                emptyMessage="No rewards added yet. Create your first reward!"
                className="rewards-list__content"
            />

            {isAddingReward && (
                <div className="rewards-list__form-overlay" onClick={handleOverlayClick}>
                    <div className="rewards-list__form">
                        <input
                            type="text"
                            placeholder="Add new reward (press Enter)"
                            value={newRewardTitle}
                            onChange={(e) => setNewRewardTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="rewards-list__input"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </div>
    );
}; 