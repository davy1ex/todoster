import { FC, useRef, useEffect } from 'react';
import './SettingsModal.css';
import './ThemeSwitcher.css';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ArchivedTasks } from '@/entities/task/ui/ArchivedTasks';
import { ArchivedGoals } from '@/entities/goal/ui/ArchivedGoals';
import { ArchivedRewards } from '@/entities/reward/ui/ArchivedRewards/ArchivedRewards';
import { taskStore } from '@/entities/task/model/store';
import { goalStore } from '@/entities/goal/model/store';
import { rewardStore } from '@/entities/reward/model/store';
import { AutoBackupSettings } from '@/features/autoBackup';

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
    const { clearArchive: clearTaskArchive } = taskStore();
    const { clearArchive: clearGoalArchive } = goalStore();
    const { clearArchive: clearRewardArchive } = rewardStore();

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

    const handleClearArchives = () => {
        if (window.confirm('Are you sure you want to clear all archives? This cannot be undone.')) {
            clearTaskArchive();
            clearGoalArchive();
            clearRewardArchive();
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result;
            if (typeof content === 'string') {
                onImportData(content);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-modal">
            <div className="settings-modal__content" ref={modalRef}>
                <div className="settings-modal__header">
                    <h2>Settings</h2>
                    <button onClick={onClose}>&times;</button>
                </div>

                <div className="settings-modal__section">
                    <h3>Theme</h3>
                    <div className="settings-modal__theme">
                        <ThemeSwitcher />
                    </div>
                    
                    <h3>Data Management</h3>
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
                            onClick={onClearData}
                            className="settings-modal__button settings-modal__button--danger"
                        >
                            Clear Account Data
                        </button>
                    </div>
                    
                    <AutoBackupSettings />
                </div>

                <div className="settings-modal__section">
                    <div className="settings-modal__archive-header">
                        <h3>Archives</h3>
                        <button onClick={handleClearArchives} className="settings-modal__clear-archive-btn">
                            Clear All Archives
                        </button>
                    </div>
                    <div className="settings-modal__archives">
                        <ArchivedTasks />
                        <ArchivedGoals />
                        <ArchivedRewards />
                    </div>
                </div>
            </div>
        </div>
    );
}; 