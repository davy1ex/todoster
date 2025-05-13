import { FC, ReactNode, useEffect } from 'react';
import { useSettings } from './useSettings';
import { SettingsModal } from '../ui/SettingsModal';
import { SettingsContext } from './SettingsContext';
import { appEvents, APP_EVENTS } from '@/shared/lib/events';

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
    const settings = useSettings();

    useEffect(() => {
        // Subscribe to settings open event
        const unsubscribe = appEvents.on(APP_EVENTS.OPEN_SETTINGS, settings.openSettingsModal);
        
        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
        };
    }, [settings.openSettingsModal]);

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