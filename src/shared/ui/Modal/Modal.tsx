import { ReactNode, useEffect } from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export const Modal = ({ isOpen, onClose, children, title="Edit" }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => {
                document.removeEventListener('keydown', handleEscape);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="modal" 
            onClick={handleBackdropClick} 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="modal__content">
                {title && (
                    <div className="modal__header">
                        <h2 id="modal-title">{title}</h2>
                        <button 
                            onClick={onClose}
                            className="modal__closeButton"
                            aria-label="Close modal"
                        >
                            ×
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};