import { TaskListComponent } from "@/entities/taskList"
import { taskStore } from "@/entities/task"
import { useTaskManagementContext } from "@/features/taskManagement/ui/TaskManagementProvider"
import "./BasicLayout.css"

export const BasicLayout = () => {
    const { tasks } = taskStore((state) => state)
    const { handleTaskCheck, openTaskModal } = useTaskManagementContext()

    return (
        <div className="basicLayout">
            <div className="basicLayout__header">
                <h1>Task App</h1>
            </div>
            
            <div className="basicLayout__content__taskList">
                <TaskListComponent 
                    id={1}
                    title="Inbox" 
                    tasks={tasks.filter((task) => task.list === "Inbox")} 
                    onCheckTask={handleTaskCheck}
                    handleClick={(task) => openTaskModal(task)}
                    isArchived={false} 
                    createdAt={new Date()} 
                    updatedAt={new Date()} />   
                <TaskListComponent 
                    id={2}
                    title="Backlog" 
                    tasks={tasks.filter((task) => task.list === "Backlog")} 
                    onCheckTask={handleTaskCheck}
                    handleClick={(task) => openTaskModal(task)}
                    isArchived={false} 
                    createdAt={new Date()} 
                    updatedAt={new Date()} />
            </div>
        </div>
    )
}