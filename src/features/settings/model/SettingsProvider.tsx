import { createContext, useContext, FC, ReactNode } from 'react';
import { useSettings } from './useSettings';
import { SettingsModal } from '../ui/SettingsModal';
import type { SettingsContextType } from './types';

const SettingsContext = createContext<SettingsContextType | null>(null);

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
};

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
    const settings = useSettings();

    return (
        <SettingsContext.Provider value={settings}>
            {children}
            {settings.isSettingsModalOpen && (
                <SettingsModal
                    onClose={settings.closeSettingsModal}
                    onClearData={settings.clearAccountData}
                    onExportData={settings.exportAccountData}
                    onImportData={settings.importAccountData}
                />
            )}
        </SettingsContext.Provider>
    );
}; 