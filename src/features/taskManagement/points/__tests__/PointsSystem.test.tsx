import { taskStore } from '@/entities/task/model/store';
import { rewardStore } from '@/entities/reward/model/store';
import type { Task, DateBox } from '@/entities/task/model/type';

// Mock the stores
jest.mock('@/entities/task/model/store');
jest.mock('@/entities/reward/model/store', () => ({
    getState: jest.fn().mockReturnValue({
        totalCoins: 0,
        addCoins: jest.fn(),
        removeCoins: jest.fn(),
    })
}));

describe('Points System Tests', () => {
    const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: '',
        isDone: false,
        list: 'Inbox',
        reward: 10,
        date_box: 'later' as DateBox,
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false
    };

    beforeEach(() => {
        // Reset store states before each test
        taskStore.setState({ tasks: [mockTask], archivedTasks: [] });
        rewardStore.getState().totalCoins = 0;
        jest.clearAllMocks();
    });

    test('Points increase when completing task', () => {
        // Get initial points
        const initialPoints = rewardStore.getState().totalCoins;
        
        // Complete the task
        taskStore.getState().checkTask(mockTask.id);

        // Verify points were added
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(mockTask.reward);
        expect(taskStore.getState().tasks[0].isDone).toBe(true);
    });

    test('Points decrease when unchecking task', () => {
        // First complete the task
        taskStore.getState().checkTask(mockTask.id);
        
        // Clear the mock to track new calls
        jest.clearAllMocks();

        // Uncheck the task
        taskStore.getState().checkTask(mockTask.id);

        // Verify points were removed
        expect(rewardStore.getState().removeCoins).toHaveBeenCalledWith(mockTask.reward);
        expect(taskStore.getState().tasks[0].isDone).toBe(false);
    });

    test('Points update correctly when changing task reward', () => {
        // Complete task with initial reward
        taskStore.getState().checkTask(mockTask.id);
        
        // Clear the mock to track new calls
        jest.clearAllMocks();

        // Change the reward amount
        const newReward = 20;
        taskStore.getState().changeReward(mockTask.id, newReward);

        // Verify the task reward was updated
        expect(taskStore.getState().tasks[0].reward).toBe(newReward);

        // Uncheck and recheck the task to verify new reward is used
        taskStore.getState().checkTask(mockTask.id); // uncheck
        expect(rewardStore.getState().removeCoins).toHaveBeenCalledWith(newReward);

        taskStore.getState().checkTask(mockTask.id); // check
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(newReward);
    });

    test('Points persist between sessions', () => {
        // Mock localStorage
        const mockLocalStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });

        // Mock the stored data
        const mockStoredPoints = 50;
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
            state: { totalCoins: mockStoredPoints }
        }));

        // Simulate app reload by recreating the store
        const { totalCoins } = rewardStore.getState();
        
        // Verify points were restored
        expect(totalCoins).toBe(mockStoredPoints);
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('rewards-storage');
    });

    test('Points system handles multiple tasks correctly', () => {
        const mockTasks: Task[] = [
            { ...mockTask, id: 1, reward: 10 },
            { ...mockTask, id: 2, reward: 20 },
            { ...mockTask, id: 3, reward: 30 }
        ];

        taskStore.setState({ tasks: mockTasks, archivedTasks: [] });

        // Complete all tasks
        mockTasks.forEach(task => {
            taskStore.getState().checkTask(task.id);
        });

        // Verify points were added for each task
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(10);
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(20);
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(30);

        // Uncheck one task
        taskStore.getState().checkTask(mockTasks[1].id);
        expect(rewardStore.getState().removeCoins).toHaveBeenCalledWith(20);
    });
}); 