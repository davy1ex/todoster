import { FC, useRef, useEffect } from 'react';
import './SettingsModal.css';
import './ThemeSwitcher.css';
import { ThemeSwitcher } from './ThemeSwitcher';


interface SettingsModalProps {
    onClose: () => void;
    onClearData: () => void;
    onExportData: () => void;
    onImportData: (data: string) => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({
    onClose,
    onClearData,
    onExportData,
    onImportData
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to clear all account data? This action cannot be undone.')) {
            onClearData();
            onClose();
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                try {
                    onImportData(content);
                    onClose();
                } catch (error) {
                    alert('Failed to import data. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="settings-modal">
            <div className="settings-modal__content" ref={modalRef}>
                <div className="settings-modal__header">
                    <h2>Settings</h2>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="settings-modal__section">
                    Theme: <ThemeSwitcher />
                    
                    <h3>Account Data</h3>
                    <div className="settings-modal__actions">
                        <button 
                            onClick={onExportData}
                            className="settings-modal__button settings-modal__button--primary"
                        >
                            Export Account Data
                        </button>
                        
                        <button 
                            onClick={handleImportClick}
                            className="settings-modal__button settings-modal__button--secondary"
                        >
                            Import Account Data
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            style={{ display: 'none' }}
                        />
                        
                        <button 
                            onClick={handleClearData}
                            className="settings-modal__button settings-modal__button--danger"
                        >
                            Clear Account Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 