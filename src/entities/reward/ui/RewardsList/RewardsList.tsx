import { FC, useState, KeyboardEvent } from 'react';
import { rewardStore } from '../../model/store';
import { RewardCard } from '../RewardCard/RewardCard';
import './RewardsList.css';

export const RewardsList: FC = () => {
    const rewards = rewardStore((state) => state.rewards);
    const addReward = rewardStore((state) => state.addReward);
    
    const [newRewardTitle, setNewRewardTitle] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newRewardTitle.trim()) {
            addReward({
                title: newRewardTitle.trim(),
                cost: 10, // Default cost
            });
            setNewRewardTitle('');
        }
    };

    return (
        <div className="rewards-list">
            <h2 className="rewards-list__title">Rewards</h2>
            
            <div className="rewards-list__form">
                <input
                    type="text"
                    placeholder="Add new reward (press Enter)"
                    value={newRewardTitle}
                    onChange={(e) => setNewRewardTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="rewards-list__input"
                />
            </div>

            <div className="rewards-list__items">
                {rewards.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} />
                ))}
                {rewards.length === 0 && (
                    <p className="rewards-list__empty">No rewards added yet. Create your first reward!</p>
                )}
            </div>
        </div>
    );
}; 