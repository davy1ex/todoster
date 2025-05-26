import { ReactNode, useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { GenericListProps } from '../GenericList/GenericList';
import './SortableList.css';
import './dnd-fixes.css';

export interface SortableItem {
  id: number | string;
  [key: string]: any;
}

export interface SortableListProps<T extends SortableItem> extends Omit<GenericListProps<T>, 'renderItem'> {
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
}

export function SortableList<T extends SortableItem>({
  title,
  items,
  onAdd,
  onReorder,
  renderItem,
  addButtonText = 'Add',
  emptyMessage = 'No items yet',
  className = '',
}: SortableListProps<T>) {
  const [sortedItems, setSortedItems] = useState<T[]>(items);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  
  // Update sorted items when items prop changes
  if (JSON.stringify(items) !== JSON.stringify(sortedItems)) {
    setSortedItems(items);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex(item => item.id === active.id);
      const newIndex = sortedItems.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(sortedItems, oldIndex, newIndex);
      setSortedItems(newItems);
      onReorder(newItems);
    }
  }

  // Find the active item based on activeId
  const activeItem = activeId ? sortedItems.find(item => item.id === activeId) : null;

  // Custom drop animation to maintain dimensions
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  return (
    <div className={`sortable-list ${className}`}>
      <div className="sortable-list__header">
        <h2 className="sortable-list__title">{title}</h2>
        <button 
          className="sortable-list__add-button"
          onClick={onAdd}
        >
          {addButtonText}
        </button>
      </div>

      <div className="sortable-list__content">
        {sortedItems.length > 0 ? (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={sortedItems.map(item => ({ id: item.id }))}
              strategy={verticalListSortingStrategy}
            >
              {sortedItems.map((item, index) => renderItem(item, index))}
            </SortableContext>
          </DndContext>
        ) : (
          <p className="sortable-list__empty">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
} 