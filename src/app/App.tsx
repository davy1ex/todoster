import { BasicLayout } from "@/shared/ui/BasicLayout"
import { TaskManagementProvider } from "@/features/taskManagement/model/TaskManagementProvider"

export const App = () => {
    return (
        <TaskManagementProvider>
            <BasicLayout />
        </TaskManagementProvider>
    )
}
