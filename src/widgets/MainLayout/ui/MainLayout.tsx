import { taskStore } from "@/entities/task"
import { ProjectList } from "@/entities/project"
import { GoalList } from "@/entities/goal"
import { BrainDump } from "@/entities/brainDump/ui/BrainDump"
import { Header } from "@/shared/ui/Header"
import { RewardsList } from "@/features/rewardManagement"
import { useState, useEffect } from "react"
import { InboxList } from "@/features/taskManagement"
import { BacklogList } from "@/features/taskManagement"
import type { Task } from "@/entities/task"
import { TaskEditModal } from "@/features/taskManagement/ui/TaskEditModal"
import { BaseLayout } from "@/shared/ui/BaseLayout"
import "./MainLayout.css"
export const MainLayout = () => {
    const { tasks, updateTask, changeReward, checkTask } = taskStore((state) => state)
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Get the current task from the store using the selectedTaskId
    const selectedTask = selectedTaskId ? tasks.find(task => task.id === selectedTaskId) : null;

    const handleTaskClick = (task: Task) => {
        setSelectedTaskId(task.id);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTaskId(null);
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }

    // If the selected task is deleted or no longer exists in the store, close the modal
    useEffect(() => {
        if (selectedTaskId && !tasks.some(task => task.id === selectedTaskId)) {
            handleCloseModal();
        }
    }, [tasks, selectedTaskId]);

    const sidebarContent =  (
        <div className={`sidebar ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
            <button 
                className="sidebar-toggle"
                onClick={toggleSidebar}
                aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                >
                {isSidebarOpen ? '←' : '→'}
            </button>
            {
                isSidebarOpen && (
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
                )
            }
        </div>
        
    )

    const mainContent = (
        <div data-testid="main-content" className="mainLayout__content" >
            <div data-testid="inbox-list">
                <InboxList
                    tasks={tasks}
                    onCheckTask={checkTask}
                    onTaskClick={handleTaskClick}
                />
            </div>
            <div data-testid="backlog-list">
                <BacklogList
                    tasks={tasks}
                    onCheckTask={checkTask}
                    onTaskClick={handleTaskClick}
                />
            </div>
            <div data-testid="projects-section" className="mainLayout__content__projects">
                <ProjectList />
            </div>
            <div data-testid="goals-section" className="mainLayout__content__goals">
                <GoalList />
            </div>
            <div data-testid="rewards-section" className="mainLayout__content__rewards">
                <RewardsList />
            </div>
        </div>
    );

    return (
        <div className="main-layout" data-testid="main-layout">
            <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <h1 data-testid="app-title" style={{textAlign: "center"}}>Человек 2.0 панель управления ну пипец хаха</h1>
            
            <BaseLayout
                data-testid="base-layout"
                sidebarContent={sidebarContent}
                mainContent={mainContent}
                isSidebarOpen={isSidebarOpen}
            />

            {selectedTask && (
                <TaskEditModal
                    data-testid="task-edit-modal"
                    isOpen={isModalOpen}
                    task={selectedTask}
                    onClose={handleCloseModal}
                    onUpdateTask={updateTask}
                    onChangeReward={(amount) => changeReward(selectedTask.id, amount)}
                    onCheckTask={checkTask}
                />
            )}
        </div>
    );
}; 