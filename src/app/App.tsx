import { useEffect, FC } from 'react';
import { migrateGoalProjectLinks } from '../entities/goal/model/migrateGoals';
import { BasicLayout } from "@/shared/ui/BasicLayout"
import { TaskManagementProvider } from "@/features/taskManagement/model/TaskManagementProvider"
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
                <TaskManagementProvider>
                    <BasicLayout />
                </TaskManagementProvider>
            </SettingsProvider>
        </ThemeProvider>
    )
}
