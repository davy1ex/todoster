import { FC } from 'react';
import { MainLayout } from '@/widgets/MainLayout';
import { ThemeProvider } from '@/shared/theme/ThemeContext';
import { SettingsProvider } from '@/features/settings';
import type { Platform } from './lib/platform';
import './main.css';

interface AppProps {
    platform: Platform;
}

export const App: FC<AppProps> = ({ platform }) => {
    return (
        <ThemeProvider>
            <SettingsProvider>
                <div data-testid="app-root" className="app">
                    <MainLayout />
                </div>
            </SettingsProvider>
        </ThemeProvider>
    );
};
