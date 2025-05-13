import { FC, useState } from 'react';
import { Reward } from '../../model/types';
import { rewardStore } from '../../model/store';
import './RewardModal.css';

interface RewardModalProps {
    reward: Reward;
    onClose: () => void;
}

export const RewardModal: FC<RewardModalProps> = ({ reward, onClose }) => {
    const [title, setTitle] = useState(reward.title);
    const [cost, setCost] = useState(reward.cost.toString());
    const deleteReward = rewardStore((state) => state.deleteReward);
    const updateReward = rewardStore((state) => state.updateReward);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (title.trim() && Number(cost) > 0) {
            updateReward(reward.id, {
                title: title.trim(),
                cost: Number(cost),
            });
            onClose();
        }
    };

    const handleDelete = () => {
        deleteReward(reward.id);
        onClose();
    };

    return (
        <div className="reward-modal">
            <div className="reward-modal__content">
                <div className="reward-modal__header">
                    <h2>Edit Reward</h2>
                    <button 
                        className="reward-modal__close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="reward-modal__form">
                    <div className="reward-modal__field">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="reward-modal__input"
                        />
                    </div>

                    <div className="reward-modal__field">
                        <label htmlFor="cost">Cost</label>
                        <input
                            id="cost"
                            type="number"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            min="1"
                            className="reward-modal__input"
                        />
                    </div>

                    <div className="reward-modal__actions">
                        <button 
                            type="submit" 
                            className="reward-modal__save-btn"
                            disabled={!title.trim() || !cost || Number(cost) <= 0}
                        >
                            Save Changes
                        </button>
                        <button 
                            type="button"
                            className="reward-modal__delete-btn"
                            onClick={handleDelete}
                        >
                            Delete Reward
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 