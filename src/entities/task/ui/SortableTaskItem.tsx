import { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../model/type';
import { TaskComponent } from './TaskComponent/TaskComponent';
import './SortableTaskItem.css';

interface SortableTaskItemProps {
  task: Task;
  listName: string;
  onCheckTask: (id: number) => void;
  handleClick: () => void;
}

export const SortableTaskItem = ({
  task,
  listName,
  onCheckTask,
  handleClick
}: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      task, // Pass full task data to maintain dimensions
      type: 'task',
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    position: 'relative' as const,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-task-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="sortable-task-item-container" {...attributes}>
        <div 
          className="sortable-task-item-handle" 
          {...listeners}
          title="Drag to reorder"
        >
          <span className="drag-handle">≡</span>
        </div>
        <TaskComponent
          task={task}
          listName={listName}
          onCheckTask={onCheckTask}
          handleClick={handleClick}
        />
      </div>
    </div>
  );
}; 