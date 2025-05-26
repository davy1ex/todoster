import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SortableTaskItem } from '../SortableTaskItem';
import { Task } from '../../model/type';
import { useSortable } from '@dnd-kit/sortable';

// Mock the dnd-kit dependencies
jest.mock('@dnd-kit/sortable', () => ({
  useSortable: jest.fn(),
}));

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}));

// Mock the TaskComponent
jest.mock('../TaskComponent/TaskComponent', () => ({
  TaskComponent: ({ task }: { task: Task }) => (
    <div data-testid="task-component">{task.title}</div>
  ),
}));

describe('SortableTaskItem', () => {
  const mockTask: Task = {
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
    order: 0,
  };

  const mockHandlers = {
    onCheckTask: jest.fn(),
    handleClick: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock useSortable implementation with default values
    (useSortable as jest.Mock).mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      transition: null,
      isDragging: false,
    });
  });

  test('renders the task component inside a sortable wrapper', () => {
    render(
      <SortableTaskItem
        task={mockTask}
        listName="Inbox"
        onCheckTask={mockHandlers.onCheckTask}
        handleClick={mockHandlers.handleClick}
      />
    );

    // Check if SortableTaskItem is rendered
    expect(screen.getByTestId('task-component')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    
    // Check if the drag handle exists
    expect(screen.getByTitle('Drag to reorder')).toBeInTheDocument();
    expect(screen.getByText('≡')).toBeInTheDocument();
  });

  test('applies dragging class when isDragging is true', () => {
    // Set isDragging to true for this test
    (useSortable as jest.Mock).mockReturnValue({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      transition: null,
      isDragging: true,
    });

    const { container } = render(
      <SortableTaskItem
        task={mockTask}
        listName="Inbox"
        onCheckTask={mockHandlers.onCheckTask}
        handleClick={mockHandlers.handleClick}
      />
    );

    // Check if the dragging class is applied
    expect(container.firstChild).toHaveClass('dragging');
  });
}); 