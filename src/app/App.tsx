import { BasicLayout } from "@/shared/ui/BasicLayout"
import { TaskManagementProvider } from "@/features/taskManagement"

export const App = () => {
    return (
        <TaskManagementProvider>
            <BasicLayout />
        </TaskManagementProvider>
    )
}
