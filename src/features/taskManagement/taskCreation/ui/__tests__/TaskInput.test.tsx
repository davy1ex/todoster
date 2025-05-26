import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskInput } from '../TaskInput';
import { taskStore } from '@/entities/task/model/store';

// Mock the taskStore
jest.mock('@/entities/task/model/store');

describe('Task Creation Tests', () => {
    beforeEach(() => {
        // Reset taskStore state before each test
        taskStore.setState({ tasks: [], archivedTasks: [] });
    });

    describe('1. Task Creation', () => {
        test('Can add task to Inbox', () => {
            render(<TaskInput listName="Inbox" />);
            
            const input = screen.getByTestId('task-title-input');
            const pointsInput = screen.getByTestId('task-points-input');
            const addButton = screen.getByTestId('add-task-button');

            fireEvent.change(input, { target: { value: 'New inbox task' } });
            fireEvent.change(pointsInput, { target: { value: '15' } });
            fireEvent.click(addButton);

            const tasks = taskStore.getState().tasks;
            expect(tasks).toHaveLength(1);
            expect(tasks[0].title).toBe('New inbox task');
            expect(tasks[0].list).toBe('Inbox');
            expect(tasks[0].reward).toBe(15);
        });

        test('Can add task to Backlog', () => {
            render(<TaskInput listName="Backlog" dateBox="today" />);
            
            const input = screen.getByTestId('task-title-input');
            const addButton = screen.getByTestId('add-task-button');

            fireEvent.change(input, { target: { value: 'New backlog task' } });
            fireEvent.click(addButton);

            const tasks = taskStore.getState().tasks;
            expect(tasks).toHaveLength(1);
            expect(tasks[0].title).toBe('New backlog task');
            expect(tasks[0].list).toBe('Backlog');
            expect(tasks[0].date_box).toBe('today');
        });

        test('Tasks have correct default values', () => {
            render(<TaskInput listName="Inbox" />);
            
            const input = screen.getByTestId('task-title-input');
            const pointsInput = screen.getByTestId('task-points-input');
            
            // Check default points value
            expect(pointsInput).toHaveValue(10);

            fireEvent.change(input, { target: { value: 'Task with defaults' } });
            fireEvent.click(screen.getByTestId('add-task-button'));

            const task = taskStore.getState().tasks[0];
            expect(task).toMatchObject({
                title: 'Task with defaults',
                description: '',
                isDone: false,
                reward: 10,
                isArchived: false,
                date_box: 'later'
            });
            expect(task.createdAt).toBeInstanceOf(Date);
            expect(task.updatedAt).toBeInstanceOf(Date);
        });

        test('Cannot add empty tasks', () => {
            render(<TaskInput listName="Inbox" />);
            
            const input = screen.getByTestId('task-title-input');
            const addButton = screen.getByTestId('add-task-button');

            // Try to add empty task
            fireEvent.click(addButton);
            expect(taskStore.getState().tasks).toHaveLength(0);

            // Try to add whitespace-only task
            fireEvent.change(input, { target: { value: '   ' } });
            fireEvent.click(addButton);
            expect(taskStore.getState().tasks).toHaveLength(0);
        });

        test('Enter key works for task creation', () => {
            render(<TaskInput listName="Inbox" />);
            
            const input = screen.getByTestId('task-title-input');
            
            fireEvent.change(input, { target: { value: 'Task with enter key' } });
            fireEvent.keyDown(input, { key: 'Enter' });

            const tasks = taskStore.getState().tasks;
            expect(tasks).toHaveLength(1);
            expect(tasks[0].title).toBe('Task with enter key');
        });

        test('Shift+Enter should not create task', () => {
            render(<TaskInput listName="Inbox" />);
            
            const input = screen.getByTestId('task-title-input');
            
            fireEvent.change(input, { target: { value: 'Task with shift+enter' } });
            fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

            expect(taskStore.getState().tasks).toHaveLength(0);
        });

        test('Clear input after task creation', () => {
            render(<TaskInput listName="Inbox" />);
            
            const input = screen.getByTestId('task-title-input');
            const pointsInput = screen.getByTestId('task-points-input');
            
            // Add task and check if inputs are cleared
            fireEvent.change(input, { target: { value: 'Task to clear' } });
            fireEvent.change(pointsInput, { target: { value: '20' } });
            fireEvent.click(screen.getByTestId('add-task-button'));

            expect(input).toHaveValue('');
            expect(pointsInput).toHaveValue(10); // Should reset to default
        });

        test('Points input validation', () => {
            render(<TaskInput listName="Inbox" />);
            
            const pointsInput = screen.getByTestId('task-points-input');
            
            // Test negative value
            fireEvent.change(pointsInput, { target: { value: '-5' } });
            expect(pointsInput).toHaveValue(10); // Should keep previous value

            // Test non-numeric value
            fireEvent.change(pointsInput, { target: { value: 'abc' } });
            expect(pointsInput).toHaveValue(10); // Should keep previous value
        });

        test('Can set custom points reward during task creation', () => {
            render(<TaskInput listName="Inbox" />);
            
            const input = screen.getByTestId('task-title-input');
            const pointsInput = screen.getByTestId('task-points-input');
            const addButton = screen.getByTestId('add-task-button');

            // Set task title and custom points
            fireEvent.change(input, { target: { value: 'High value task' } });
            fireEvent.change(pointsInput, { target: { value: '50' } });
            fireEvent.click(addButton);

            const tasks = taskStore.getState().tasks;
            expect(tasks).toHaveLength(1);
            expect(tasks[0].title).toBe('High value task');
            expect(tasks[0].reward).toBe(50);

            // Verify points input resets to default after task creation
            expect(pointsInput).toHaveValue(10);
        });
    });
}); 