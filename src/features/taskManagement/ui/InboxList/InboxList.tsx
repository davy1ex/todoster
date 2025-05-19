import { FC } from 'react';
import { Task, taskStore } from '@/entities/task';
import { useTaskFiltering } from '@/features/taskManagement/taskFiltering';
import { TaskInput } from '@/features/taskManagement/taskCreation';
import { SortableTaskItem } from '@/entities/task/ui/SortableTaskItem';
import {
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import './InboxList.css';

interface InboxListProps {
  tasks: Task[];
  onCheckTask: (id: number) => void;
  onTaskClick: (task: Task) => void;
}

export const InboxList: FC<InboxListProps> = ({
  tasks,
  onCheckTask,
  onTaskClick,
}) => {
  const { getFilteredTasks } = useTaskFiltering();
  const filteredTasks = getFilteredTasks(tasks, "Inbox");
  const reorderTasks = taskStore((state) => state.reorderTasks);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex(task => task.id === active.id);
      const newIndex = filteredTasks.findIndex(task => task.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(filteredTasks, oldIndex, newIndex);
        
        // Only reorder tasks that belong to the Inbox list
        const inboxTasks = newItems.filter(task => task.list === "Inbox");
        
        if (inboxTasks.length > 0) {
          console.log('Reordering Inbox tasks', inboxTasks);
          reorderTasks(inboxTasks);
        }
      }
    }
  };

  return (
    <div className="inbox-list">
      <div className="inbox-list__title">
        <h2>Inbox</h2>
      </div>
      
      <div className="inbox-list__header">
        <TaskInput listName="Inbox" dateBox="later" />
      </div>
      
      <div className="inbox-list__tasks">
        {filteredTasks.length > 0 ? (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredTasks.map(task => ({ id: task.id }))}
              strategy={verticalListSortingStrategy}
            >
              {filteredTasks.map(task => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  listName="Inbox"
                  onCheckTask={onCheckTask}
                  handleClick={() => onTaskClick(task)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="inbox-list__empty">
            No tasks in Inbox
          </div>
        )}
      </div>
    </div>
  );
}; 