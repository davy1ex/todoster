import { ReactNode, forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string | number;
  children: ReactNode;
  className?: string;
}

export const SortableItem = forwardRef<HTMLDivElement, SortableItemProps>(
  ({ id, children, className = '' }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`sortable-item ${isDragging ? 'dragging' : ''} ${className}`}
        {...attributes}
      >
        <div className="sortable-item-wrapper">
          <div className="sortable-item-indicator" {...listeners} title="Drag to reorder">
            <span className="drag-handle">≡</span>
          </div>
          {children}
        </div>
      </div>
    );
  }
); 