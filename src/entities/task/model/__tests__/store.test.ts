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

describe('taskStore', () => {
  // Clear the store before each test
  beforeEach(() => {
    const store = taskStore.getState();
    store.tasks.forEach(task => store.deleteTask(task.id));
    store.archivedTasks.forEach(task => store.deleteTask(task.id));
  });

  describe('reorderTasks', () => {
    it('should reorder tasks based on the provided array', () => {
      const store = taskStore.getState();
      
      // Add some test tasks
      const task1: Task = {
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
        order: 0,
      };
      
      const task2: Task = {
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
        order: 1,
      };
      
      const task3: Task = {
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
        order: 2,
      };
      
      store.addTask(task1);
      store.addTask(task2);
      store.addTask(task3);
      
      // Reorder tasks: 3, 1, 2
      store.reorderTasks([task3, task1, task2]);
      
      // Get tasks and check their order
      const tasks = store.tasks;
      const task1After = tasks.find(t => t.id === 1);
      const task2After = tasks.find(t => t.id === 2);
      const task3After = tasks.find(t => t.id === 3);
      
      expect(task1After?.order).toBe(1);
      expect(task2After?.order).toBe(2);
      expect(task3After?.order).toBe(0);
    });
    
    it('should maintain task properties other than order', () => {
      const store = taskStore.getState();
      
      // Add a test task
      const task: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description',
        isDone: true,
        list: 'Backlog',
        reward: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
        isArchived: false,
        date_box: 'week',
        order: 0,
      };
      
      store.addTask(task);
      
      // Reorder task (changes order property only)
      store.reorderTasks([{ ...task, order: 5 }]);
      
      // Get task and check its properties
      const updatedTask = store.tasks.find(t => t.id === 1);
      
      expect(updatedTask?.order).toBe(0); // Should be 0 since it's the first task
      expect(updatedTask?.title).toBe('Task 1');
      expect(updatedTask?.description).toBe('Description');
      expect(updatedTask?.isDone).toBe(true);
      expect(updatedTask?.list).toBe('Backlog');
      expect(updatedTask?.reward).toBe(20);
      expect(updatedTask?.date_box).toBe('week');
    });
    
    it('should handle empty task arrays', () => {
      const store = taskStore.getState();
      
      // Reorder with empty array (should not cause errors)
      expect(() => store.reorderTasks([])).not.toThrow();
    });
  });
}); 