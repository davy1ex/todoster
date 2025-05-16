import { FC, useState } from 'react';
import { Reward } from '../../model/types';
import { rewardStore } from '../../model/store';
import { RewardModal } from '../RewardModal/RewardModal';
import { CoinIcon } from '@/shared/ui/icons';
import './RewardCard.css';

interface RewardCardProps {
    reward: Reward;
}

export const RewardCard: FC<RewardCardProps> = ({ reward }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalCoins = rewardStore((state) => state.totalCoins);
    const { claimReward, archiveReward } = rewardStore();
    
    const isClaimable = totalCoins >= reward.cost;

    const handleClaim = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isClaimable) {
            claimReward(reward.id);
        }
    };

    const handleArchive = (e: React.MouseEvent) => {
        e.stopPropagation();
        archiveReward(reward.id);
    };

    return (
        <>
            <div 
                className={`reward-card ${isClaimable ? 'reward-card--claimable' : ''}`}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="reward-card__content">
                    <h3 className="reward-card__title">{reward.title}</h3>
                    <div className="reward-card__cost">
                        <CoinIcon className="reward-card__coin-icon" />
                        <span>{reward.cost}</span>
                    </div>
                </div>
                <div className="reward-card__actions">
                    <button 
                        className="reward-card__archive-btn"
                        onClick={handleArchive}
                        title="Archive reward"
                    >
                        📦
                    </button>
                    <button 
                        className="reward-card__claim-btn"
                        onClick={handleClaim}
                        disabled={!isClaimable}
                    >
                        Claim
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <RewardModal
                    reward={reward}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}; 