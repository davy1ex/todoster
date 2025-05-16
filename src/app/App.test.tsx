import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor, act } from '@testing-library/react';
import { App } from './App';
import type { Platform } from './lib/platform';
import { taskStore } from '@/entities/task';
import type { Task, DateBox } from '@/entities/task/model/type';

// Mock localStorage
const localStorageMock = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => localStorageMock.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
        localStorageMock.store[key] = value;
    }),
    clear: vi.fn(() => {
        localStorageMock.store = {};
    }),
    removeItem: vi.fn((key: string) => {
        delete localStorageMock.store[key];
    }),
    length: 0,
    key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Create a mock platform for testing
const mockPlatform: Platform = {
    type: "web",
    isElectron: false,
    isAndroid: false,
    isWeb: true
};

// Helper function to get tasks from storage
const getTasksFromStorage = (): Task[] => {
    const storedData = JSON.parse(localStorageMock.store['tasks-storage']);
    return storedData.state.tasks;
};

// Helper function to create a task
const createTask = (title: string, list: string = 'Inbox', dateBox: DateBox = 'later'): Partial<Task> => ({
    title,
    description: '',
    isDone: false,
    list,
    reward: 0,
    date_box: dateBox,
});

describe('App', () => {
    beforeEach(() => {
        // Clear localStorage and reset mocks before each test
        localStorageMock.clear();
        vi.clearAllMocks();
        
        // Reset the task store state and initialize localStorage
        const initialState = {
            tasks: [],
            archivedTasks: []
        };
        
        taskStore.setState(initialState);
        
        localStorageMock.store = {
            'tasks-storage': JSON.stringify({
                state: initialState,
                version: 0
            }),
            'theme': '"dark"'
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders without crashing', () => {
        render(<App platform={mockPlatform} />);
        
        // Check for app title
        const titleElement = screen.getByText('GamifiedTodo');
        expect(titleElement).toBeInTheDocument();
    });

    it('renders task lists', () => {
        render(<App platform={mockPlatform} />);
        
        // Check for both task lists
        const inboxList = screen.getByText('Inbox');
        const backlogList = screen.getByText('Backlog');
        
        expect(backlogList).toBeInTheDocument();
    });

    describe('InboxList', () => {
        const setupInboxTest = () => {
            render(<App platform={mockPlatform} />);
            const taskList = screen.getByTestId('task-list');
            const inboxSection = taskList.querySelector('.inbox-list') as HTMLElement;
            return {
                inputField: within(inboxSection).getByPlaceholderText('Add a task to Inbox'),
                addButton: within(inboxSection).getByRole('button', { name: '+' }),
                inboxSection
            };
        };
    
        // Helper to create and add a task
        const addTaskToInbox = async (title: string) => {
            const { inputField, addButton } = setupInboxTest();
            await act(async () => {
                fireEvent.change(inputField, { target: { value: title } });
                fireEvent.click(addButton);
            });
            return screen.findByText(title);
        };
    
        it('adds a new task to the inbox list', async () => {
            const taskTitle = 'Test task';
            const taskElement = await addTaskToInbox(taskTitle);
            
            expect(taskElement).toBeInTheDocument();
            expect(screen.queryByText('No tasks in Inbox')).not.toBeInTheDocument();
            
            const tasks = getTasksFromStorage();
            expect(tasks.some(t => t.title === taskTitle)).toBe(true);
        });
    
        it('can check/complete a task in the inbox list', async () => {
            const taskTitle = 'Task to complete';
            const taskElement = await addTaskToInbox(taskTitle);
            
            const taskComponent = taskElement.closest('.taskComponent') as HTMLElement;
            const checkbox = within(taskComponent).getByRole('checkbox');
            
            await act(async () => {
                fireEvent.click(checkbox);
            });
            
            expect(taskComponent).toHaveClass('taskComponent--done');
            expect(checkbox).toBeChecked();
            
            const tasks = getTasksFromStorage();
            const task = tasks.find(t => t.title === taskTitle);
            expect(task?.isDone).toBe(true);
        });
        it('renders empty state correctly', () => {
            render(<App platform={mockPlatform} />);
            
            // Check for empty state message
            const emptyMessage = screen.getByText('No tasks in Inbox');
            expect(emptyMessage).toBeInTheDocument();
            
            // Check for input field
            const inputField = screen.getByPlaceholderText('Add a task to Inbox');
            expect(inputField).toBeInTheDocument();
        });

        it('has a working add task input', () => {
            render(<App platform={mockPlatform} />);
            
            // Find the task list container and inbox section
            const taskList = screen.getByTestId('task-list');
            const inboxSection = taskList.querySelector('.inbox-list') as HTMLElement;
            expect(inboxSection).toBeInTheDocument();
            
            // Get the input field and add button within the inbox section
            const inputField = within(inboxSection).getByPlaceholderText('Add a task to Inbox');
            const addButton = within(inboxSection).getByRole('button', { name: '+' });
            
            expect(addButton).toBeInTheDocument();
        });

        // it('adds a new task to the inbox list', async () => {
        //     render(<App platform={mockPlatform} />);
            
        //     const taskList = screen.getByTestId('task-list');
        //     const inboxSection = taskList.querySelector('.inbox-list') as HTMLElement;
        //     const inputField = within(inboxSection).getByPlaceholderText('Add a task to Inbox');
        //     const addButton = within(inboxSection).getByRole('button', { name: '+' });
            
        //     const taskTitle = 'Test task';
        //     const task = createTask(taskTitle);
            
        //     // Add task and wait for all updates to complete
        //     await act(async () => {
        //         fireEvent.change(inputField, { target: { value: taskTitle } });
        //         fireEvent.click(addButton);
        //     });

        //     // Wait for both UI and storage updates
        //     await waitFor(async () => {
        //         const tasks = getTasksFromStorage();
        //         const hasTask = tasks.some((t: Task) => t.title === taskTitle);
        //         expect(hasTask).toBe(true);
                
        //         const taskElement = screen.queryByText(taskTitle);
        //         expect(taskElement).toBeInTheDocument();
        //     }, { timeout: 2000 });

        //     const emptyMessage = screen.queryByText('No tasks in Inbox');
        //     expect(emptyMessage).not.toBeInTheDocument();
        // });

        // it('can check/complete a task in the inbox list', async () => {
        //     render(<App platform={mockPlatform} />);
            
        //     const taskList = screen.getByTestId('task-list');
        //     const inboxSection = taskList.querySelector('.inbox-list') as HTMLElement;
        //     const inputField = within(inboxSection).getByPlaceholderText('Add a task to Inbox');
        //     const addButton = within(inboxSection).getByRole('button', { name: '+' });
            
        //     const taskTitle = 'Task to complete';
        //     const task = createTask(taskTitle);
            
        //     // Add task and wait for all updates to complete
        //     await act(async () => {
        //         fireEvent.change(inputField, { target: { value: taskTitle } });
        //         fireEvent.click(addButton);
        //     });

        //     // Wait for task to be added
        //     await waitFor(async () => {
        //         const tasks = getTasksFromStorage();
        //         const hasTask = tasks.some((t: Task) => t.title === taskTitle);
        //         expect(hasTask).toBe(true);
        //     });

        //     // Find and check the task
        //     const taskComponent = await screen.findByText(taskTitle)
        //         .then(el => el.closest('.taskComponent')) as HTMLElement;
        //     const checkbox = within(taskComponent).getByRole('checkbox') as HTMLInputElement;
            
        //     await act(async () => {
        //         fireEvent.click(checkbox);
        //     });

        //     // Wait for completion status to be updated
        //     await waitFor(async () => {
        //         const tasks = getTasksFromStorage();
        //         const task = tasks.find((t: Task) => t.title === taskTitle);
        //         expect(task?.isDone).toBe(true);
                
        //         expect(taskComponent).toHaveClass('taskComponent--done');
        //         expect(checkbox.checked).toBe(true);
        //     }, { timeout: 2000 });
        // });

        // it('persists tasks after page reload', async () => {
        //     // Mock the stored task data
        //     const mockTask = {
        //         id: 123,
        //         title: 'Persistent task',
        //         description: '',
        //         isDone: true,
        //         list: 'Inbox',
        //         reward: 0,
        //         createdAt: new Date().toISOString(),
        //         updatedAt: new Date().toISOString(),
        //         isArchived: false,
        //         date_box: 'later' as const
        //     };

        //     // Set up localStorage with pre-existing task
        //     localStorageMock.store['tasks-storage'] = JSON.stringify({
        //         state: {
        //             tasks: [mockTask],
        //             archivedTasks: []
        //         },
        //         version: 0
        //     });

        //     // Reset the task store state to include our mock task
        //     taskStore.setState({
        //         tasks: [{ ...mockTask, createdAt: new Date(mockTask.createdAt), updatedAt: new Date(mockTask.updatedAt) }],
        //         archivedTasks: []
        //     });
            
        //     // Initial render
        //     render(<App platform={mockPlatform} />);
            
        //     // Verify task appears in UI with correct state
        //     const taskElement = await screen.findByText('Persistent task');
        //     expect(taskElement).toBeInTheDocument();

        //     const taskComponent = taskElement.closest('.taskComponent') as HTMLElement;
        //     expect(taskComponent).toBeInTheDocument();
        //     expect(taskComponent).toHaveClass('taskComponent--done');

        //     const checkbox = within(taskComponent).getByRole('checkbox') as HTMLInputElement;
        //     expect(checkbox.checked).toBe(true);
        // });

        // it('can add a task to the backlog list', async () => {
        //     render(<App platform={mockPlatform} />);
            
        //     const taskList = screen.getByTestId('task-list');
        //     const backlogSection = taskList.querySelector('.backlog-list') as HTMLElement;
        //     const inputField = within(backlogSection).getByPlaceholderText('Add a task to Backlog');
        //     const addButton = within(backlogSection).getByRole('button', { name: '+' });
            
        //     const taskTitle = 'Backlog task';
        //     const task = createTask(taskTitle, 'Backlog', 'today');
            
        //     // Add task and wait for all updates to complete
        //     await act(async () => {
        //         fireEvent.change(inputField, { target: { value: taskTitle } });
        //         fireEvent.click(addButton);
        //     });

        //     // Wait for both UI and storage updates
        //     await waitFor(async () => {
        //         const tasks = getTasksFromStorage();
        //         const hasTask = tasks.some((t: Task) => t.title === taskTitle);
        //         expect(hasTask).toBe(true);
                
        //         const taskElement = screen.queryByText(taskTitle);
        //         expect(taskElement).toBeInTheDocument();
        //     }, { timeout: 2000 });

        //     const emptyMessage = screen.queryByText("No tasks in today's list");
        //     expect(emptyMessage).not.toBeInTheDocument();
        // });

        // it('opens task modal on click and closes on Escape', async () => {
        //     render(<App platform={mockPlatform} />);
            
        //     // Create a new task first
        //     const taskList = screen.getByTestId('task-list');
        //     const inboxSection = taskList.querySelector('.inbox-list') as HTMLElement;
        //     const inputField = within(inboxSection).getByPlaceholderText('Add a task to Inbox');
        //     const addButton = within(inboxSection).getByRole('button', { name: '+' });
            
        //     const taskTitle = 'Task to open in modal';
        //     await act(async () => {
        //         fireEvent.change(inputField, { target: { value: taskTitle } });
        //         fireEvent.click(addButton);
        //     });
            
        //     // Wait for the task to appear
        //     const taskComponent = await screen.findByText(taskTitle).then(el => el.closest('.taskComponent')) as HTMLElement;
        //     expect(taskComponent).toBeInTheDocument();
            
        //     // Click the task to open modal
        //     fireEvent.click(taskComponent.querySelector('.taskComponent__main') as HTMLElement);
            
        //     // Verify modal is open by checking for modal content
        //     const modalElement = await screen.findByRole('textbox', { name: /task title/i });
        //     expect(modalElement).toBeInTheDocument();
        //     expect(modalElement).toHaveValue(taskTitle);
            
        //     // Press Escape to close modal
        //     fireEvent.keyDown(document, { key: 'Escape' });
            
        //     // Verify modal is closed
        //     await waitFor(() => {
        //         expect(screen.queryByRole('textbox', { name: /task title/i })).not.toBeInTheDocument();
        //     });
        // });
    });
}); 