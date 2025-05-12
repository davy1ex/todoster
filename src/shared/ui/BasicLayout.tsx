import { TaskListComponent } from "@/entities/taskList"
import { taskStore } from "@/entities/task"
import { useTaskManagementContext } from "@/features/taskManagement/model/TaskManagementProvider"
import { BrainDump } from "@/entities/brainDump/ui/BrainDump"
import "./BasicLayout.css"

export const BasicLayout = () => {
    const { tasks } = taskStore((state) => state)
    const { handleTaskCheck, openTaskModal } = useTaskManagementContext()

    return (
        <div className="basicLayout" role="main">
            <div className="basicLayout__header">
                <h1>Task App</h1>
            </div>
            
            <div className="basicLayout__content">
                <div className="basicLayout__content__brainDump">
                    <BrainDump />
                </div>
                <div className="basicLayout__content__taskList" data-testid="task-list">
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
        </div>
    )
}