import { taskStore } from '../store';
import { Task } from '../type';

// Mock the rewardStore to prevent side effects
jest.mock('../../../reward/model/store', () => ({
  rewardStore: {
    getState: () => ({
      addCoins: jest.fn(),
      removeCoins: jest.fn(),
    }),
  },
}));

describe('taskStore reorderTasks', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = taskStore.getState();
    store.tasks.forEach(task => store.deleteTask(task.id));
  });

  test('reorders tasks correctly', () => {
    const store = taskStore.getState();
    
    // Add some test tasks
    const task1 = {
      id: 1,
      title: 'Task 1',
      description: '',
      isDone: false,
      list: 'Inbox',
      reward: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      date_box: 'today',
    };
    
    const task2 = {
      id: 2,
      title: 'Task 2',
      description: '',
      isDone: false,
      list: 'Inbox',
      reward: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      date_box: 'today',
    };
    
    const task3 = {
      id: 3,
      title: 'Task 3',
      description: '',
      isDone: false,
      list: 'Inbox',
      reward: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      date_box: 'today',
    };
    
    store.addTask(task1);
    store.addTask(task2);
    store.addTask(task3);
    
    // Get the current tasks
    const initialTasks = [...store.tasks];
    
    // Create a new order: Task 3, Task 1, Task 2
    const reorderedTasks = [
      { id: 3 },
      { id: 1 },
      { id: 2 },
    ];
    
    // Reorder the tasks
    store.reorderTasks(reorderedTasks);
    
    // Get updated tasks
    const updatedTasks = store.tasks;
    
    // Check if the orders have been updated
    const task1After = updatedTasks.find(t => t.id === 1);
    const task2After = updatedTasks.find(t => t.id === 2);
    const task3After = updatedTasks.find(t => t.id === 3);
    
    expect(task1After?.order).toBe(1);
    expect(task2After?.order).toBe(2);
    expect(task3After?.order).toBe(0);
  });

  test('preserves other task properties when reordering', () => {
    const store = taskStore.getState();
    
    // Add a test task
    const task = {
      id: 1,
      title: 'Task 1',
      description: 'Description',
      isDone: false,
      list: 'Backlog',
      reward: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      date_box: 'week',
    };
    
    store.addTask(task);
    
    // Mark task as done
    store.checkTask(1);
    
    // Reorder the task (should maintain its properties)
    store.reorderTasks([{ id: 1 }]);
    
    // Get updated task
    const updatedTask = store.tasks.find(t => t.id === 1);
    
    expect(updatedTask?.order).toBe(0);
    expect(updatedTask?.isDone).toBe(true);
    expect(updatedTask?.title).toBe('Task 1');
    expect(updatedTask?.description).toBe('Description');
    expect(updatedTask?.list).toBe('Backlog');
    expect(updatedTask?.reward).toBe(20);
    expect(updatedTask?.date_box).toBe('week');
  });

  test('handles empty array without error', () => {
    const store = taskStore.getState();
    
    // Add a task to make sure we have something to test with
    store.addTask({
      id: 1,
      title: 'Test Task',
      description: '',
      isDone: false,
      list: 'Inbox',
      reward: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      date_box: 'today',
    });
    
    const initialTaskCount = store.tasks.length;
    
    // This should not throw an error
    expect(() => {
      store.reorderTasks([]);
    }).not.toThrow();
    
    // Tasks should remain unchanged
    expect(store.tasks.length).toBe(initialTaskCount);
  });
}); 