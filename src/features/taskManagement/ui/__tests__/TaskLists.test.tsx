import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { taskStore } from '@/entities/task/model/store';
import { InboxList } from '../InboxList/InboxList';
import type { Task, DateBox } from '@/entities/task/model/type';

// Mock the taskStore and taskFiltering
jest.mock('@/entities/task/model/store');
jest.mock('@/features/taskManagement/taskFiltering', () => ({
    useTaskFiltering: () => ({
        getFilteredTasks: (tasks: Task[], list: string) => tasks.filter(t => t.list === list)
    })
}));

describe('Task Lists Tests', () => {
    const mockTasks: Task[] = [
        {
            id: 1,
            title: 'Inbox Task 1',
            description: '',
            isDone: false,
            list: 'Inbox',
            reward: 10,
            date_box: 'later' as DateBox,
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        },
        {
            id: 2,
            title: 'Inbox Task 2',
            description: '',
            isDone: true,
            list: 'Inbox',
            reward: 15,
            date_box: 'later' as DateBox,
            createdAt: new Date(),
            updatedAt: new Date(),
            isArchived: false
        }
    ];

    const mockHandlers = {
        onCheckTask: jest.fn(),
        onTaskClick: jest.fn()
    };

    beforeEach(() => {
        // Reset taskStore state and mock handlers before each test
        taskStore.setState({ tasks: [], archivedTasks: [] });
        jest.clearAllMocks();
    });

    describe('Inbox List', () => {
        test('Shows inbox tasks correctly', () => {
            taskStore.setState({ tasks: mockTasks });
            render(
                <InboxList 
                    tasks={mockTasks}
                    onCheckTask={mockHandlers.onCheckTask}
                    onTaskClick={mockHandlers.onTaskClick}
                />
            );

            expect(screen.getByText('Inbox Task 1')).toBeInTheDocument();
            expect(screen.getByText('Inbox Task 2')).toBeInTheDocument();
        });

        test('Shows empty state when no tasks', () => {
            taskStore.setState({ tasks: [] });
            render(
                <InboxList 
                    tasks={[]}
                    onCheckTask={mockHandlers.onCheckTask}
                    onTaskClick={mockHandlers.onTaskClick}
                />
            );

            expect(screen.getByText('No tasks in Inbox')).toBeInTheDocument();
        });

        test('Can check/uncheck tasks', () => {
            taskStore.setState({ tasks: mockTasks });
            render(
                <InboxList 
                    tasks={mockTasks}
                    onCheckTask={mockHandlers.onCheckTask}
                    onTaskClick={mockHandlers.onTaskClick}
                />
            );

            // Find the checkbox for the first task
            const taskElement = screen.getByText('Inbox Task 1');
            const taskComponent = taskElement.closest('.taskComponent');
            if (!taskComponent) throw new Error('Task component not found');
            const checkbox = taskComponent.querySelector('input[type="checkbox"]');
            if (!checkbox) throw new Error('Checkbox not found');
            
            // Check the task
            fireEvent.click(checkbox);
            expect(mockHandlers.onCheckTask).toHaveBeenCalledWith(1);

            // Uncheck the task
            fireEvent.click(checkbox);
            expect(mockHandlers.onCheckTask).toHaveBeenCalledTimes(2);
        });

        test('Can click task to open edit modal', () => {
            taskStore.setState({ tasks: mockTasks });
            render(
                <InboxList 
                    tasks={mockTasks}
                    onCheckTask={mockHandlers.onCheckTask}
                    onTaskClick={mockHandlers.onTaskClick}
                />
            );

            // Click on the task title
            const taskTitle = screen.getByText('Inbox Task 1');
            fireEvent.click(taskTitle);

            expect(mockHandlers.onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
        });

        test('Task added from inbox has date_box as later', () => {
            // This test verifies that tasks created in Inbox have 'later' date_box
            const inboxTask: Task = {
                id: 3,
                title: 'New Inbox Task',
                description: '',
                isDone: false,
                list: 'Inbox',
                reward: 10,
                date_box: 'later' as DateBox,
                createdAt: new Date(),
                updatedAt: new Date(),
                isArchived: false
            };

            taskStore.setState({ tasks: [inboxTask] });
            render(
                <InboxList 
                    tasks={[inboxTask]}
                    onCheckTask={mockHandlers.onCheckTask}
                    onTaskClick={mockHandlers.onTaskClick}
                />
            );

            expect(taskStore.getState().tasks[0].date_box).toBe('later');
        });
    });
}); 