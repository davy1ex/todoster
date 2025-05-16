import { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal" onClick={handleBackdropClick}>
            <div className="modal__content">
                {title && (
                    <div className="modal__header">
                        <h2>{title}</h2>
                        <button 
                            onClick={onClose}
                            className="modal__closeButton"
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