import { taskStore } from "@/entities/task";
import type { DateBox, ImportanceLevel, UrgencyLevel } from "@/entities/task/model/type";

interface CreateTaskDTO {
    title: string;
    list: string;
    date_box: DateBox;
    reward?: number;
    urgent?: UrgencyLevel;
    important?: ImportanceLevel;
}

export const useTaskCreation = () => {
    const addTask = taskStore((state) => state.addTask);

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
            reward: taskData.reward ?? 10, // Use provided reward or default to 10
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false,
            date_box: taskData.date_box,
            urgent: taskData.urgent ?? null,
            important: taskData.important ?? null,
        });
    };

    return {
        createTask,
    };
}; 