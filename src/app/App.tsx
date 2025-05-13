import { useEffect } from 'react';
import { migrateGoalProjectLinks } from '../entities/goal/model/migrateGoals';
import { BasicLayout } from "@/shared/ui/BasicLayout"
import { TaskManagementProvider } from "@/features/taskManagement/model/TaskManagementProvider"
import { SettingsProvider } from "@/features/settings"

export const App = () => {
    useEffect(() => {
        // Run migration when app starts
        migrateGoalProjectLinks();
    }, []);

    return (
        <SettingsProvider>
            <TaskManagementProvider>
                <BasicLayout />
            </TaskManagementProvider>
        </SettingsProvider>
    )
}
