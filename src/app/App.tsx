import { FC } from 'react';
import { MainLayout } from '@/widgets/MainLayout';
import { ThemeProvider } from '@/shared/theme/ThemeContext';
import { SettingsProvider } from '@/features/settings';
import { AutoBackupProvider, AutoBackupIndicator } from '@/features/autoBackup';
import type { Platform } from './lib/platform';
import './main.css';

interface AppProps {
    platform: Platform;
}

export const App: FC<AppProps> = ({ platform }) => {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <AutoBackupProvider>
                    <div data-testid="app-root" className="app">
                        <MainLayout />
                        <AutoBackupIndicator />
                    </div>
                </AutoBackupProvider>
            </SettingsProvider>
        </ThemeProvider>
    );
};
