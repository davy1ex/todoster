import { FC } from 'react';
import { Task, taskStore } from '@/entities/task';
import { useTaskFiltering } from '@/features/taskManagement/taskFiltering';
import { TaskInput } from '@/features/taskManagement/taskCreation';
import { DateBoxTabs } from '@/entities/task';
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
import './BacklogList.css';

interface BacklogListProps {
  tasks: Task[];
  onCheckTask: (id: number) => void;
  onTaskClick: (task: Task) => void;
}

export const BacklogList: FC<BacklogListProps> = ({
  tasks,
  onCheckTask,
  onTaskClick,
}) => {
  const { 
    selectedDateBox, 
    setSelectedDateBox, 
    getFilteredTasks,
    getTaskCounts 
  } = useTaskFiltering();
  
  const filteredTasks = getFilteredTasks(tasks, "Backlog");
  const taskCounts = getTaskCounts(tasks);
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
        
        // Update the order property for each task
        const updatedTasks = newItems.map((task, index) => ({
          ...task,
          order: index
        }));
        
        // Only reorder tasks that belong to the Backlog list and current date box
        const backlogTasks = updatedTasks.filter(
          task => task.list === "Backlog" && 
                 task.date_box === selectedDateBox
        );
        
        if (backlogTasks.length > 0) {
          reorderTasks(backlogTasks);
        }
      }
    }
  };

  return (
    <div className="backlog-list">
      <div className="backlog-list__title">
        <h2>Backlog</h2>
        <DateBoxTabs
          selectedDateBox={selectedDateBox}
          onSelect={setSelectedDateBox}
          taskCounts={taskCounts}
        />
      </div>
      
      <div className="backlog-list__header">
        <TaskInput listName="Backlog" dateBox={selectedDateBox} />
      </div>
      
      <div className="backlog-list__tasks">
        {filteredTasks.length > 0 ? (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={filteredTasks}
              strategy={verticalListSortingStrategy}
            >
              {filteredTasks.map(task => (
                <SortableTaskItem
                  key={task.id}
                  task={task}
                  listName="Backlog"
                  onCheckTask={onCheckTask}
                  handleClick={() => onTaskClick(task)}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="backlog-list__empty">
            No tasks in {selectedDateBox === "today" ? "today's" : selectedDateBox === "week" ? "this week's" : "later"} list
          </div>
        )}
      </div>
    </div>
  );
}; 