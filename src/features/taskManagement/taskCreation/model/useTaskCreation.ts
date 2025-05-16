import { taskStore } from "@/entities/task";
import type { DateBox } from "@/entities/task/model/type";

interface CreateTaskDTO {
    title: string;
    list: string;
    date_box: DateBox;
}

export const useTaskCreation = () => {
    const { addTask } = taskStore();

    const createTask = (taskData: CreateTaskDTO) => {
        // Here we can add any additional logic like:
        // - API calls
        // - Validation
        // - Error handling
        // - Task preprocessing
        addTask({
            id: Date.now(),
            title: taskData.title,
            description: "",
            isDone: false,
            list: taskData.list,
            reward: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false,
            date_box: taskData.date_box,
        });
    };

    return {
        createTask,
    };
}; 