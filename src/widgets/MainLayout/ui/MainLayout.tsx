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
        <>
            <InboxList
                tasks={tasks}
                onCheckTask={checkTask}
                onTaskClick={handleTaskClick}
            />
            <BacklogList
                tasks={tasks}
                onCheckTask={checkTask}
                onTaskClick={handleTaskClick}
            />
            <div className="mainLayout__content__projects">
                <ProjectList />
            </div>
            <div className="mainLayout__content__goals">
                <GoalList />
            </div>
            <div className="mainLayout__content__rewards">
                <RewardsList />
            </div>
        </>
    );

    return (
        <>
            <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <h1 style={{textAlign: "center"}}>Человек 2.0 панель управления ну пипец хаха</h1>
            


            <BaseLayout
                sidebarContent={sidebarContent}
                mainContent={mainContent}
                isSidebarOpen={isSidebarOpen}
            />

            {selectedTask && (
                <TaskEditModal
                    isOpen={isModalOpen}
                    task={selectedTask}
                    onClose={handleCloseModal}
                    onUpdateTask={updateTask}
                    onChangeReward={(amount) => changeReward(selectedTask.id, amount)}
                    onCheckTask={checkTask}
                />
            )}
        </>
    );
}; 