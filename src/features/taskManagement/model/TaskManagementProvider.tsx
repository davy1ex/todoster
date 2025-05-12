import { createContext, useContext, ReactNode } from 'react'
import { useTaskManagement } from '../model/useTaskManagement'
import type { TaskManagementContextType } from '../model/types'
import { TaskEditModal } from '../ui/TaskEditModal'

const TaskManagementContext = createContext<TaskManagementContextType | null>(null)

export const useTaskManagementContext = () => {
    const context = useContext(TaskManagementContext)
    if (!context) {
        throw new Error('useTaskManagementContext must be used within a TaskManagementProvider')
    }
    return context
}

interface TaskManagementProviderProps {
    children: ReactNode
}

export const TaskManagementProvider = ({ children }: TaskManagementProviderProps) => {
    const taskManagement = useTaskManagement()

    return (
        <TaskManagementContext.Provider value={taskManagement}>
            {children}
            {taskManagement.isModalOpen && taskManagement.selectedTask && (
                <TaskEditModal
                    task={taskManagement.selectedTask}
                    onChangeReward={taskManagement.handleRewardChange}
                    onClose={taskManagement.closeTaskModal}
                    onUpdateTask={taskManagement.handleTaskUpdate}
                />
            )}
        </TaskManagementContext.Provider>
    )
} 