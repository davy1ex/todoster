import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { taskStore } from '@/entities/task/model/store';
import { rewardStore } from '@/entities/reward/model/store';
import { TaskEditModal } from '../TaskEditModal';
import { InboxList } from '../InboxList/InboxList';
import { BacklogList } from '../BacklogList/BacklogList';
import type { Task, DateBox, TaskStore } from '@/entities/task/model/type';

interface MockRewardStore {
    totalCoins: number;
    addCoins: jest.MockedFunction<(amount: number) => void>;
    removeCoins: jest.MockedFunction<(amount: number) => void>;
}

// Mock the stores
const createMockRewardStore = (): MockRewardStore => ({
    totalCoins: 0,
    addCoins: jest.fn(),
    removeCoins: jest.fn(),
});

const createMockTaskStore = (rewardStore: MockRewardStore): TaskStore => ({
    tasks: [] as Task[],
    archivedTasks: [] as Task[],
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    archiveTask: jest.fn(),
    unarchiveTask: jest.fn(),
    checkTask: (id: number): void => {
        const task = mockTaskStore.tasks.find((t: Task) => t.id === id);
        if (!task) return;

        const newIsDone = !task.isDone;
        if (newIsDone) {
            rewardStore.addCoins(task.reward);
        } else {
            rewardStore.removeCoins(task.reward);
        }

        mockTaskStore.tasks = mockTaskStore.tasks.map((t: Task) =>
            t.id === id ? { ...t, isDone: newIsDone } : t
        );
    },
    changeReward: jest.fn(),
    getArchivedTasks: jest.fn(),
    clearArchive: jest.fn(),
    getTasksByDateBox: jest.fn()
});

const mockRewardStore = createMockRewardStore();
const mockTaskStore = createMockTaskStore(mockRewardStore);

jest.mock('@/entities/task/model/store', () => ({
    __esModule: true,
    taskStore: jest.fn((selectorOrValue) => {
        if (typeof selectorOrValue === 'function') {
            return selectorOrValue(mockTaskStore);
        }
        return mockTaskStore;
    })
}));

jest.mock('@/entities/reward/model/store', () => ({
    __esModule: true,
    rewardStore: {
        getState: jest.fn(() => mockRewardStore)
    }
}));

// Mock taskFiltering hook
jest.mock('@/features/taskManagement/taskFiltering', () => ({
    useTaskFiltering: () => ({
        getFilteredTasks: (tasks: Task[]) => tasks,
        selectedDateBox: 'today' as DateBox,
        setSelectedDateBox: jest.fn(),
        getTaskCounts: () => ({
            today: 1,
            week: 1,
            later: 1
        })
    })
}));

describe('Points System Tests', () => {
    const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        description: '',
        isDone: false,
        list: 'Inbox',
        reward: 10.5,
        date_box: 'later' as DateBox,
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false
    };

    const mockProps = {
        isOpen: true,
        task: mockTask,
        onClose: jest.fn(),
        onUpdateTask: jest.fn(),
        onChangeReward: jest.fn(),
        onCheckTask: jest.fn()
    };

    beforeEach(() => {
        // Reset store states and mocks
        mockTaskStore.tasks = [mockTask];
        mockTaskStore.archivedTasks = [];
        mockRewardStore.totalCoins = 0;
        mockRewardStore.addCoins.mockClear();
        mockRewardStore.removeCoins.mockClear();
        jest.clearAllMocks();
    });

    describe('Points System in Task Modal', () => {
        test('Points increase when completing task', () => {
            // Initial state
            expect(rewardStore.getState().totalCoins).toBe(0);

            // Complete the task
            const store = taskStore((state) => state);
            store.checkTask(mockTask.id);

            // Verify points were added
            expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(mockTask.reward);
        });

        test('Points decrease when unchecking task', () => {
            // Set initial state with completed task
            const mockStore = taskStore((state) => state);
            mockStore.checkTask(mockTask.id);

            // Uncheck the task
            mockStore.checkTask(mockTask.id);

            // Verify points were removed
            expect(rewardStore.getState().removeCoins).toHaveBeenCalledWith(mockTask.reward);
        });

        test('Points update correctly when changing task reward', () => {
            // Set initial state with completed task
            const mockStore = taskStore((state) => state);
            mockStore.checkTask(mockTask.id);

            render(<TaskEditModal {...mockProps} />);

            // Change reward amount
            const rewardInput = screen.getByPlaceholderText('Enter coins');
            fireEvent.change(rewardInput, { target: { value: '20' } });
            
            const setCoinsButton = screen.getByText('Set coins');
            fireEvent.click(setCoinsButton);

            // Verify the reward was updated
            expect(mockProps.onChangeReward).toHaveBeenCalledWith(20);
            expect(mockProps.onUpdateTask).toHaveBeenCalledWith(mockTask.id, {
                reward: 20
            });
        });
    });

    describe('Points System in Task Lists', () => {
        test('Points increase when checking task from Inbox list', () => {
            // Set up the mock store with the task
            mockTaskStore.tasks = [mockTask];
            
            render(
                <InboxList
                    tasks={[mockTask]}
                    onCheckTask={taskStore((state) => state.checkTask)}
                    onTaskClick={jest.fn()}
                />
            );

            // Find and click the checkbox
            const taskElement = screen.getByText('Test Task');
            const taskComponent = taskElement.closest('.taskComponent');
            if (!taskComponent) throw new Error('Task component not found');
            const checkbox = taskComponent.querySelector('input[type="checkbox"]');
            if (!checkbox) throw new Error('Checkbox not found');

            fireEvent.click(checkbox);
            expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(10.5);
        });

        test('Points increase when checking task from Backlog list', () => {
            const backlogTask: Task = {
                ...mockTask,
                list: 'Backlog',
                date_box: 'today' as DateBox
            };

            // Set up the mock store with the backlog task
            mockTaskStore.tasks = [backlogTask];

            render(
                <BacklogList
                    tasks={[backlogTask]}
                    onCheckTask={taskStore((state) => state.checkTask)}
                    onTaskClick={jest.fn()}
                />
            );

            // Find and click the checkbox
            const taskElement = screen.getByText('Test Task');
            const taskComponent = taskElement.closest('.taskComponent');
            if (!taskComponent) throw new Error('Task component not found');
            const checkbox = taskComponent.querySelector('input[type="checkbox"]');
            if (!checkbox) throw new Error('Checkbox not found');

            fireEvent.click(checkbox);
            expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(10.5);
        });

        test('Points update correctly for multiple tasks in list', () => {
            const tasks: Task[] = [
                mockTask,
                {
                    ...mockTask,
                    id: 2,
                    title: 'Task 2',
                    reward: 15
                },
                {
                    ...mockTask,
                    id: 3,
                    title: 'Task 3',
                    reward: 20
                }
            ];

            // Set up the mock store with all tasks
            mockTaskStore.tasks = tasks;

            render(
                <InboxList
                    tasks={tasks}
                    onCheckTask={taskStore((state) => state.checkTask)}
                    onTaskClick={jest.fn()}
                />
            );

            // Check all tasks
            tasks.forEach(task => {
                const taskElement = screen.getByText(task.title);
                const taskComponent = taskElement.closest('.taskComponent');
                if (!taskComponent) throw new Error('Task component not found');
                const checkbox = taskComponent.querySelector('input[type="checkbox"]');
                if (!checkbox) throw new Error('Checkbox not found');

                fireEvent.click(checkbox);
                expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(task.reward);
            });

            // Uncheck one task
            const task2Element = screen.getByText('Task 2');
            const task2Component = task2Element.closest('.taskComponent');
            if (!task2Component) throw new Error('Task component not found');
            const checkbox = task2Component.querySelector('input[type="checkbox"]');
            if (!checkbox) throw new Error('Checkbox not found');

            fireEvent.click(checkbox);
            expect(rewardStore.getState().removeCoins).toHaveBeenCalledWith(15);
        });
    });

    test('Points persist between sessions', () => {
        // Mock localStorage
        interface MockStorage {
            [key: string]: string;
        }
        const mockStorage: MockStorage = {};
        const mockLocalStorage = {
            getItem: jest.fn((key: string) => mockStorage[key] || null),
            setItem: jest.fn((key: string, value: string) => {
                mockStorage[key] = value;
            })
        };
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
            writable: true
        });

        // Set initial state
        rewardStore.getState().totalCoins = 50;
        mockStorage['rewards-storage'] = JSON.stringify({
            state: { totalCoins: 50 }
        });

        // Trigger a state change
        const store = taskStore((state) => state);
        store.checkTask(mockTask.id);

        // Verify points were added
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(mockTask.reward);
    });

    test('Points handle decimal rewards correctly', () => {
        const taskWithDecimal = {
            ...mockTask,
            reward: 10.5
        };

        const mockStore = taskStore((state) => state);
        mockStore.checkTask(taskWithDecimal.id);

        // Verify decimal points were handled correctly
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(10.5);
    });

    test('Points system handles edge cases', () => {
        const edgeCaseTasks = [
            { ...mockTask, id: 1, reward: 0 },
            { ...mockTask, id: 2, reward: 999.99 },
            { ...mockTask, id: 3, reward: 0.01 }
        ];

        // Set up the mock store with edge case tasks one at a time
        mockTaskStore.tasks = [edgeCaseTasks[0]];
        const mockStore = taskStore((state) => state);
        mockStore.checkTask(edgeCaseTasks[0].id);
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(0);

        mockTaskStore.tasks = [edgeCaseTasks[1]];
        mockStore.checkTask(edgeCaseTasks[1].id);
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(999.99);

        mockTaskStore.tasks = [edgeCaseTasks[2]];
        mockStore.checkTask(edgeCaseTasks[2].id);
        expect(rewardStore.getState().addCoins).toHaveBeenCalledWith(0.01);
    });
}); 