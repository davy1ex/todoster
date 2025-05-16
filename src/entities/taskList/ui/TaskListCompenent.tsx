import { TaskComponent, InputTask, taskStore, Task, DateBoxTabs } from "@/entities/task"
import type { TaskList } from "../model/type"
import type { DateBox } from "@/entities/task/model/type"
import "./TaskListCompenent.css"
import { useEffect, useState } from "react"

interface TaskListComponentProps extends TaskList {
    handleClick: (task: Task) => void;
    onCheckTask: (id: number) => void;
}

export const TaskListComponent = (props: TaskListComponentProps) => {
    const { addTask } = taskStore((state) => state)
    const [selectedDateBox, setSelectedDateBox] = useState<DateBox>("today");
    const tasks = taskStore((state) => state.tasks);
    const getTasksByDateBox = taskStore((state) => state.getTasksByDateBox);

    const taskCounts = {
        today: tasks.filter(task => task.list === "Backlog" && task.date_box === "today").length,
        week: tasks.filter(task => task.list === "Backlog" && task.date_box === "week").length,
        later: tasks.filter(task => task.list === "Backlog" && task.date_box === "later").length,
    };

    const handleAddTask = (title: string) => {
        addTask({
            id: Date.now(),
            title,
            description: "",
            isDone: false,
            list: props.title,
            reward: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false,
            date_box: props.title === "Backlog" ? selectedDateBox : "later" // Only set date_box for Backlog tasks
        })
    }

    const getFilteredTasks = () => {
        // For Inbox, show only Inbox tasks without date_box filtering
        if (props.title === "Inbox") {
            return tasks.filter(task => task.list === "Inbox");
        }
        // For Backlog, filter by both list and date_box
        if (props.title === "Backlog") {
            return tasks.filter(task => 
                task.list === "Backlog" && 
                task.date_box === selectedDateBox
            );
        }
        // For any other list, just filter by list name
        return tasks.filter(task => task.list === props.title);
    };

    const filteredTasks = getFilteredTasks();

    return (
        <div className="taskListComponent">
            <div className="taskListComponent__title">
                <h2>{props.title}</h2>
                {props.title === "Backlog" && (
                    <DateBoxTabs
                        selectedDateBox={selectedDateBox}
                        onSelect={setSelectedDateBox}
                        taskCounts={taskCounts}
                    />
                )}
            </div>
            <div className="taskListComponent__header">
                <InputTask listName={props.title} onAdd={handleAddTask} />
            </div>
            
            <div className="taskListComponent__tasks">
                {filteredTasks.map((task) => (
                    <TaskComponent 
                        key={task.id} 
                        task={task} 
                        listName={props.title}
                        onCheckTask={props.onCheckTask} 
                        handleClick={() => props.handleClick(task)}
                    />
                ))} 
                {filteredTasks.length === 0 && (
                    <div className="taskListComponent__empty">
                        {props.title === "Backlog" 
                            ? `No tasks in ${selectedDateBox === "today" ? "today's" : selectedDateBox === "week" ? "this week's" : "later"} list`
                            : 'No tasks in this list'
                        }
                    </div>
                )}
            </div>
        </div>
    )
}