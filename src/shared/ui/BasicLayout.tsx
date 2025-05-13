import { TaskListComponent } from "@/entities/taskList"
import { taskStore } from "@/entities/task"
import { useTaskManagementContext } from "@/features/taskManagement/model/TaskManagementProvider"
import { ProjectList } from "@/entities/project"
import { GoalList } from "@/entities/goal"
import { BrainDump } from "@/entities/brainDump/ui/BrainDump"
import { ExcalidrawCanvas } from "@/entities/brainDump/ui/ExcalidrawCanvas"
import { Header } from "@/shared/ui/Header"
import { RewardsList } from "@/entities/reward/ui/RewardsList"
import "./BasicLayout.css"

export const BasicLayout = () => {
    const { tasks } = taskStore((state) => state)
    const { handleTaskCheck, openTaskModal } = useTaskManagementContext()

    return (
        <>
        <Header />
        <h1 style={{textAlign: "center"}}>Человек 2.0 панель управления ну пипец хаха</h1>

        <div className="basicLayout" role="main">
            <div className="basicLayout__header">
            </div>
            
            <div className="basicLayout__content">
                <div className="smallWidget">
                    <BrainDump />
                    <iframe 
                        width="500" 
                        height="700" 
                        src="https://excalidraw.com/" 
                        frameBorder="0" 
                        allowFullScreen
                    />    
                </div>
                
                <div className="basicLayout__content__lists">
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
                        <div className="basicLayout__content__projects">
                            <ProjectList />
                        </div>

                        <div className="basicLayout__content__goals">
                            <GoalList />
                        </div>

                        <div className="basicLayout__content__rewards">
                            <RewardsList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}