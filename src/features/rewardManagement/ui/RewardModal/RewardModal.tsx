import { FC, useEffect } from 'react';
import { Reward } from '@/entities/reward/model/types';
import { useRewardModal } from '../../model/useRewardModal';
import './RewardModal.css';

interface RewardModalProps {
    reward: Reward;
    onClose: () => void;
}

export const RewardModal: FC<RewardModalProps> = ({ reward, onClose }) => {
    const {
        modalRef,
        title,
        cost,
        setTitle,
        setCost,
        handleSave,
        handleDelete,
        isValid
    } = useRewardModal(reward);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    return (
        <div className="reward-modal">
            <div ref={modalRef} className="reward-modal__content">
                <div className="reward-modal__header">
                    <h2>Edit Reward</h2>
                    <button 
                        className="reward-modal__close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSave(onClose);
                }} className="reward-modal__form">
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
                            disabled={!isValid}
                        >
                            Save Changes
                        </button>
                        <button 
                            type="button"
                            className="reward-modal__delete-btn"
                            onClick={() => handleDelete(onClose)}
                        >
                            Delete Reward
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 