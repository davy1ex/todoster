import { FC, useState } from 'react';
import { taskStore } from '../../model/store';
import { TaskComponent } from '../TaskComponent/TaskComponent';
import { DateBoxTabs } from '../DateBoxTabs/DateBoxTabs';
// import { TaskModal } from '../TaskModal/TaskModal';
import type { DateBox, Task } from '../../model/type';
import { SortableList } from '@/shared/ui/SortableList';
import { SortableTaskItem } from '../SortableTaskItem';
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
import './TaskList.css';

interface TaskListProps {
  title?: string;
  listType?: 'backlog' | 'inbox';
}

export const TaskList: FC<TaskListProps> = ({ title = "Tasks", listType = 'inbox' }) => {
  const [selectedDateBox, setSelectedDateBox] = useState<DateBox>("today");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasks = taskStore((state) => state.tasks);
  const getTasksByDateBox = taskStore((state) => state.getTasksByDateBox);
  const checkTask = taskStore((state) => state.checkTask);
  const reorderTasks = taskStore((state) => state.reorderTasks);

  const taskCounts = {
    today: tasks.filter(task => task.date_box === "today").length,
    week: tasks.filter(task => task.date_box === "week").length,
    later: tasks.filter(task => task.date_box === "later").length,
    backlog: tasks.filter(task => task.date_box.toLowerCase() === "backlog").length,
  };

  const getFilteredTasks = () => {
    if (listType === 'backlog') {
      return getTasksByDateBox(selectedDateBox);
    }
    // For inbox or other lists, return all tasks sorted by order
    return tasks.filter(task => task.list.toLowerCase() === listType)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const filteredTasks = getFilteredTasks();

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
      
      const newItems = arrayMove(filteredTasks, oldIndex, newIndex);
      reorderTasks(newItems);
    }
  };

  return (
    <div className="task-list">
      <div className="task-list__header">
        <h2>{title}</h2>
        {listType === 'backlog' && (
          <DateBoxTabs
            selectedDateBox={selectedDateBox}
            onSelect={setSelectedDateBox}
            taskCounts={taskCounts}
          />
        )}
      </div>
      <div className="task-list__content">
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
                  listName={listType}
                  onCheckTask={checkTask}
                  handleClick={() => setSelectedTask(task)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="task-list__empty">
            {listType === 'backlog' 
              ? `No tasks in ${selectedDateBox === "today" ? "today's" : selectedDateBox === "week" ? "this week's" : "later"} list`
              : 'No tasks in this list'
            }
          </div>
        )}
      </div>
      {/* {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )} */}
    </div>
  );
}; 