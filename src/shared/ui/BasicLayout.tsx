import { TaskListComponent } from "@/entities/taskList"
import { taskStore } from "@/entities/task"
import { useTaskManagementContext } from "@/features/taskManagement/model/TaskManagementProvider"
import { ProjectList } from "@/entities/project"
import { GoalList } from "@/entities/goal"
import { BrainDump } from "@/entities/brainDump/ui/BrainDump"
import { ExcalidrawCanvas } from "@/entities/brainDump/ui/ExcalidrawCanvas"
import { Header } from "@/shared/ui/Header"
import { RewardsList } from "@/entities/reward/ui/RewardsList"
import { useRef, useState, MouseEvent } from "react"
import "./BasicLayout.css"

export const BasicLayout = () => {
    const { tasks } = taskStore((state) => state)
    const { handleTaskCheck, openTaskModal } = useTaskManagementContext()
    
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true)
        setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0))
        setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
    }

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0)
        const walk = (x - startX) * 2
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft - walk
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <>
        <Header />
        <h1 style={{textAlign: "center"}}>Человек 2.0 панель управления ну пипец хаха</h1>

        <div className="basicLayout" role="main">
            <div className="basicLayout__header">
            </div>
            
            <div className={`basicLayout__content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
                <div className={`sidebar ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
                    <button 
                        className="sidebar-toggle"
                        onClick={toggleSidebar}
                        aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                    >
                        {isSidebarOpen ? '←' : '→'}
                    </button>
                    {isSidebarOpen && (
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
                    )}
                </div>
                
                <div 
                    ref={scrollContainerRef}
                    className="basicLayout__content__lists"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
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