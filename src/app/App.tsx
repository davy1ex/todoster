import { useEffect, FC } from 'react';
import { migrateGoalProjectLinks } from '../entities/goal/model/migrateGoals';
import { BasicLayout } from "@/shared/ui/BasicLayout"
import { SettingsProvider } from "@/features/settings"
import type { Platform } from './lib/platform';
import { ThemeProvider } from '@/shared/theme/ThemeContext';

interface AppProps {
  platform: Platform;
}

export const App: FC<AppProps> = ({ platform }) => {
    useEffect(() => {
        // Run migration when app starts
        migrateGoalProjectLinks();
    }, []);

    return (
        <ThemeProvider>
            <SettingsProvider>
                <BasicLayout />
            </SettingsProvider>
        </ThemeProvider>
    )
}
