import { TaskComponent, InputTask, taskStore, Task } from "@/entities/task"
import type { TaskList } from "../model/type"
import "./TaskListCompenent.css"

interface TaskListComponentProps extends TaskList {
    handleClick: (task: Task) => void;
    onCheckTask: (id: number) => void;
}

export const TaskListComponent = (props: TaskListComponentProps) => {
    const { addTask } = taskStore((state) => state)

    const handleAddTask = (title: string) => {
        addTask({
            id: Date.now(),
            title,
            description: "",
            completed: false,
            list: props.title,
            reward: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    return (
        <div className="taskListComponent">
            <div className="taskListComponent__title">
                <h2>{props.title}</h2>
            </div>
            <div className="taskListComponent__header">
                <InputTask listName={props.title} onAdd={handleAddTask} />
            </div>
            
            <div className="taskListComponent__tasks">
                {props.tasks.map((task) => (
                    <TaskComponent 
                        key={task.id} 
                        task={task} 
                        listName={props.title}
                        onCheckTask={props.onCheckTask} 
                        handleClick={() => props.handleClick(task)}
                    />
                ))} 
            </div>
        </div>
    )
}