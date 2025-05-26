import React from 'react';
import { render, screen } from '@testing-library/react';
import { SortableList } from '../SortableList';

// Mock the dnd-kit modules
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-context">{children}</div>,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => ({})),
}));

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div data-testid="sortable-context">{children}</div>,
  arrayMove: jest.fn((arr) => arr),
  sortableKeyboardCoordinates: jest.fn(),
  verticalListSortingStrategy: {},
}));

describe('SortableList', () => {
  const items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
  ];

  const renderItem = (item: typeof items[0]) => (
    <div key={item.id} data-testid={`item-${item.id}`}>{item.name}</div>
  );

  it('renders the list title', () => {
    render(
      <SortableList
        title="Test List"
        items={items}
        onAdd={jest.fn()}
        onReorder={jest.fn()}
        renderItem={renderItem}
      />
    );

    expect(screen.getByText('Test List')).toBeInTheDocument();
  });

  it('renders the add button with custom text', () => {
    render(
      <SortableList
        title="Test List"
        items={items}
        onAdd={jest.fn()}
        onReorder={jest.fn()}
        renderItem={renderItem}
        addButtonText="Custom Add"
      />
    );

    expect(screen.getByText('Custom Add')).toBeInTheDocument();
  });

  it('renders all items', () => {
    render(
      <SortableList
        title="Test List"
        items={items}
        onAdd={jest.fn()}
        onReorder={jest.fn()}
        renderItem={renderItem}
      />
    );

    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument();
    
    items.forEach(item => {
      expect(screen.getByTestId(`item-${item.id}`)).toBeInTheDocument();
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('displays empty message when no items', () => {
    render(
      <SortableList
        title="Test List"
        items={[]}
        onAdd={jest.fn()}
        onReorder={jest.fn()}
        renderItem={renderItem}
        emptyMessage="Custom empty message"
      />
    );

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    expect(screen.queryByTestId('dnd-context')).not.toBeInTheDocument();
  });

  it('applies custom class name', () => {
    const { container } = render(
      <SortableList
        title="Test List"
        items={items}
        onAdd={jest.fn()}
        onReorder={jest.fn()}
        renderItem={renderItem}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 