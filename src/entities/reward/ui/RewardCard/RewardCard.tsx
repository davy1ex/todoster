import { FC, useState } from 'react';
import { Reward } from '../../model/types';
import { rewardStore } from '../../model/store';
import { RewardModal } from '../RewardModal/RewardModal';
import './RewardCard.css';

interface RewardCardProps {
    reward: Reward;
}

export const RewardCard: FC<RewardCardProps> = ({ reward }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const totalCoins = rewardStore((state) => state.totalCoins);
    const claimReward = rewardStore((state) => state.claimReward);
    const deleteReward = rewardStore((state) => state.deleteReward);
    
    const isClaimable = totalCoins >= reward.cost;

    const handleClaim = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isClaimable) {
            claimReward(reward.id);
        }
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
                        <svg 
                            className="reward-card__coin-icon"
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle 
                                cx="12" 
                                cy="12" 
                                r="8" 
                                stroke="currentColor" 
                                strokeWidth="2"
                            />
                            <path 
                                d="M12 7V17M9 10L12 7L15 10" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <span>{reward.cost}</span>
                    </div>
                </div>
                <div className="reward-card__actions">
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