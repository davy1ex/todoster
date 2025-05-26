/**
 * @file: EisenhowerMatrix.tsx
 * @description: Eisenhower Matrix component for task prioritization
 * @dependencies: entities/task, dnd-kit
 * @created: 2023-11-25
 */
import { FC, useState, useMemo } from 'react';
import { Task, taskStore, UrgencyLevel, ImportanceLevel } from '@/entities/task';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDraggable,
  useDroppable,
  UniqueIdentifier,
  DragMoveEvent,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import './EisenhowerMatrix.css';
import { TaskPriorityEditor } from '../TaskPriorityEditor/TaskPriorityEditor';
import { TaskInput } from '@/features/taskManagement/taskCreation';
import { CoinIcon } from '@/shared/ui/icons/CoinIcon';

// Define quadrant types
type QuadrantType = 'urgent_important' | 'urgent_not_important' | 'not_urgent_important' | 'not_urgent_not_important' | 'uncategorized';

// Helper function to check if a string is a valid quadrant
const isValidQuadrant = (id: string): boolean => {
  return [
    'urgent_important',
    'urgent_not_important',
    'not_urgent_important',
    'not_urgent_not_important',
    'uncategorized'
  ].includes(id);
};

// Helper function to get urgency and importance from quadrant type
const getUrgencyAndImportance = (quadrant: QuadrantType): { urgent: UrgencyLevel; important: ImportanceLevel } => {
  switch (quadrant) {
    case 'urgent_important':
      return { urgent: 'urgent', important: 'important' };
    case 'urgent_not_important':
      return { urgent: 'urgent', important: 'not important' };
    case 'not_urgent_important':
      return { urgent: 'not urgent', important: 'important' };
    case 'not_urgent_not_important':
      return { urgent: 'not urgent', important: 'not important' };
    case 'uncategorized':
    default:
      return { urgent: null, important: null };
  }
};

// Create a modified sortable task item that works both for sorting and quadrant moves
const SortableTaskItem: FC<{
  task: Task;
  onCheckTask: (id: number) => void;
  onTaskEisenhowerMatrixClick: (task: Task) => void;
  isTaskPriorityEditorOpen: boolean;
  onTaskPriorityEdit: (taskId: number) => void;
  isEditing: boolean;
  onTaskClick: (task: Task) => void;
}> = ({ 
  task, 
  onCheckTask, 
  onTaskEisenhowerMatrixClick, 
  isTaskPriorityEditorOpen,
  onTaskPriorityEdit,
  isEditing,
  onTaskClick
}) => {
  // Use the sortable hook instead of draggable for better flexibility
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id.toString(),
    data: {
      task,
      type: 'task',
      quadrant: getTaskQuadrant(task),
    }
  });

  const { archiveTask } = taskStore();


  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    transition,
  } : undefined;

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    archiveTask(task.id);
};

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={`matrix-draggable-item ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div 
        className="matrix-task-item" 
        onClick={() => {
          if (isTaskPriorityEditorOpen) {
            onTaskPriorityEdit(task.id);
          } else {
            onTaskEisenhowerMatrixClick(task);
          }
        }}
      >
        <input
          type="checkbox"
          checked={task.isDone}
          onChange={() => onCheckTask(task.id)}
          onClick={(e) => e.stopPropagation()}
        />
        <span className={task.isDone ? 'matrix-task-item__title--done' : ''}>
          {task.title}
        </span>
        <div className="taskComponent__reward">
            <CoinIcon className="reward-card__coin-icon" />
            {task.reward} 
        </div>
        <button 
          className="matrix-task-item__edit-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onTaskClick(task);
          }}
        >
          Edit
        </button>
        <button
            className="taskComponent__archive-btn"
            onClick={handleArchive}
            title="Archive task"
        >
            📦
        </button>
      </div>
      {isEditing && (
        <TaskPriorityEditor task={task} />
      )}
    </div>
  );
};

// Helper function to determine which quadrant a task belongs to
const getTaskQuadrant = (task: Task): QuadrantType => {
  if (task.urgent === 'urgent' && task.important === 'important') return 'urgent_important';
  if (task.urgent === 'urgent' && task.important === 'not important') return 'urgent_not_important';
  if (task.urgent === 'not urgent' && task.important === 'important') return 'not_urgent_important';
  if (task.urgent === 'not urgent' && task.important === 'not important') return 'not_urgent_not_important';
  return 'uncategorized';
};

// Simple component for a matrix quadrant
const Quadrant: FC<{
  id: QuadrantType;
  title: string;
  tasks: Task[];
  className: string;
  onCheckTask: (id: number) => void;
  onTaskEisenhowerMatrixClick: (task: Task) => void;
  isOver: boolean;
  isTaskPriorityEditorOpen: boolean;
  eisenhowerMatrixQuadrant: QuadrantType;
  onTaskPriorityEdit: (taskId: number) => void;
  editingTaskId: number | null;
  isExpanded: boolean;
  onToggleExpansion: (quadrantId: QuadrantType) => void;
  onTaskClick: (task: Task) => void;
}> = ({ 
    id, 
    title, 
    tasks, 
    className, 
    onCheckTask, 
    onTaskEisenhowerMatrixClick, 
    isOver, 
    isTaskPriorityEditorOpen, 
    eisenhowerMatrixQuadrant,
    onTaskPriorityEdit,
    editingTaskId,
    isExpanded,
    onToggleExpansion,
    onTaskClick
}) => {
  const { urgent, important } = getUrgencyAndImportance(eisenhowerMatrixQuadrant);
  const { setNodeRef } = useDroppable({
    id: id
  });
  
  // Create an array of task IDs for SortableContext
  const taskIds = useMemo(() => tasks.map(task => task.id.toString()), [tasks]);

  return (
    <div 
      ref={setNodeRef}
      id={id}
      className={`matrix-quadrant ${className} ${isOver ? 'matrix-quadrant--over' : ''}`}
    >
      <div className="matrix-quadrant__header" onClick={() => onToggleExpansion(id)}>
        <h3 className="matrix-quadrant__title">
          {title}
          <span className="matrix-quadrant__toggle-icon">
            {isExpanded ? '▼' : '►'}
          </span>
        </h3>
        <div className="matrix-quadrant__task-count">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="matrix-quadrant__content">
          <TaskInput listName="Eisenhower Matrix" urgent={urgent} important={important} />
          <div className="matrix-quadrant__tasks">
            {tasks.length > 0 ? (
              <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                {tasks.map(task => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onCheckTask={onCheckTask}
                    onTaskEisenhowerMatrixClick={onTaskEisenhowerMatrixClick}
                    isTaskPriorityEditorOpen={isTaskPriorityEditorOpen}
                    onTaskPriorityEdit={onTaskPriorityEdit}
                    isEditing={editingTaskId === task.id}
                    onTaskClick={onTaskClick}
                  />
                ))}
              </SortableContext>
            ) : (
              <div className="matrix-quadrant__empty">No tasks</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface EisenhowerMatrixProps {
  tasks: Task[];
  onCheckTask: (id: number) => void;
  onTaskEisenhowerMatrixClick: (task: Task) => void;
  isTaskPriorityEditorOpen: boolean;
  onTaskClick: (task: Task) => void;
}

export const EisenhowerMatrix: FC<EisenhowerMatrixProps> = ({
  tasks,
  onCheckTask,
  onTaskEisenhowerMatrixClick,
  isTaskPriorityEditorOpen,
  onTaskClick
}) => {
  const { updateTask, reorderTasks } = taskStore((state) => state);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredQuadrant, setHoveredQuadrant] = useState<QuadrantType | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  // Track expanded state of each quadrant
  const [expandedQuadrants, setExpandedQuadrants] = useState<Record<QuadrantType, boolean>>({
    urgent_important: true,
    urgent_not_important: true,
    not_urgent_important: true,
    not_urgent_not_important: true,
    uncategorized: true
  });
  // Track which quadrant is active in a drag operation
  const [activeQuadrant, setActiveQuadrant] = useState<QuadrantType | null>(null);

  // Group tasks by urgency and importance and sort by order
  const quadrants = {
    urgent_important: tasks
      .filter(task => task.urgent === 'urgent' && task.important === 'important')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    urgent_not_important: tasks
      .filter(task => task.urgent === 'urgent' && task.important === 'not important')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    not_urgent_important: tasks
      .filter(task => task.urgent === 'not urgent' && task.important === 'important')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    not_urgent_not_important: tasks
      .filter(task => task.urgent === 'not urgent' && task.important === 'not important')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    uncategorized: tasks
      .filter(task => task.urgent === null || task.important === null)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };

  // Configure sensors for the best drag experience
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Better for sorting
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Wait 250ms before activating on touch
        tolerance: 5, // Allow small movements of 5px without canceling
      },
    })
  );

  // New handler for editing task priority
  const handleTaskPriorityEdit = (taskId: number) => {
    if (isTaskPriorityEditorOpen) {
      // Toggle editing mode for this task
      setEditingTaskId(editingTaskId === taskId ? null : taskId);
    }
  };

  // New handler for toggling quadrant visibility
  const toggleQuadrantExpansion = (quadrantId: QuadrantType) => {
    setExpandedQuadrants(prev => ({
      ...prev,
      [quadrantId]: !prev[quadrantId]
    }));
  };

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id.toString();
    setActiveId(id);
    
    // Find which quadrant the task belongs to
    const taskId = Number(id);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveQuadrant(getTaskQuadrant(task));
    }
  };

  // Handle drag over event to highlight the target quadrant
  const handleDragOver = (event: DragOverEvent) => {
    // Reset hover state if not over anything
    if (!event.over) {
      setHoveredQuadrant(null);
      return;
    }

    // If over a quadrant, set it as the hovered quadrant
    const overId = String(event.over.id);
    if (isValidQuadrant(overId)) {
      setHoveredQuadrant(overId as QuadrantType);
      
      // Automatically expand the quadrant being dragged over if it's collapsed
      if (!expandedQuadrants[overId as QuadrantType]) {
        setExpandedQuadrants(prev => ({
          ...prev,
          [overId]: true
        }));
      }
    }
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setActiveQuadrant(null);

    // If not dropped over anything, do nothing
    if (!event.over) {
      setHoveredQuadrant(null);
      return;
    }

    const taskId = Number(event.active.id);
    const task = tasks.find(t => t.id === taskId);
    const overId = String(event.over.id);

    // If task not found, do nothing
    if (!task) {
      setHoveredQuadrant(null);
      return;
    }

    // If dropped over a quadrant (not another task), handle quadrant change
    if (isValidQuadrant(overId)) {
      // Ensure the target quadrant is expanded
      if (!expandedQuadrants[overId as QuadrantType]) {
        setExpandedQuadrants(prev => ({
          ...prev,
          [overId]: true
        }));
      }

      // Determine new urgency and importance based on the quadrant
      const updates = getUrgencyAndImportance(overId as QuadrantType);
      
      // Find the current highest order in the target quadrant
      const targetQuadrantTasks = quadrants[overId as QuadrantType];
      let highestOrder = -1;
      
      if (targetQuadrantTasks.length > 0) {
        highestOrder = Math.max(...targetQuadrantTasks.map(t => t.order ?? 0));
      }
      
      // Give the task an order that places it at the end of the quadrant
      const newOrder = highestOrder + 10;
      
      console.log(`Moving task ${taskId} to quadrant ${overId} with order ${newOrder}`);

      // Update the task with new quadrant and order
      updateTask(taskId, { ...updates, order: newOrder });
      setHoveredQuadrant(null);
      return;
    }

    // If dropped over another task, handle reordering
    const overTaskId = Number(overId);
    const overTask = tasks.find(t => t.id === overTaskId);

    if (!overTask) {
      setHoveredQuadrant(null);
      return;
    }

    // Only reorder if both tasks are in the same quadrant
    const taskQuadrant = getTaskQuadrant(task);
    const overTaskQuadrant = getTaskQuadrant(overTask);
    
    if (taskQuadrant === overTaskQuadrant) {
      // Get the tasks in this quadrant
      const quadrantTasks = [...quadrants[taskQuadrant]];
      
      // Find the indices
      const oldIndex = quadrantTasks.findIndex(t => t.id === taskId);
      const newIndex = quadrantTasks.findIndex(t => t.id === overTaskId);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        console.log(`Reordering in ${taskQuadrant}: Moving task ${taskId} from index ${oldIndex} to ${newIndex}`);
        
        // Reorder tasks within the quadrant
        const reordered = arrayMove(quadrantTasks, oldIndex, newIndex);
        
        // Update all tasks in this quadrant with new order property
        const tasksWithOrder = reordered.map((t, index) => ({
          ...t,
          order: index * 10 // Use a multiplier to leave space between items
        }));
        
        console.log('Reordered tasks:', tasksWithOrder.map(t => ({ id: t.id, order: t.order })));
        
        // Update the tasks in the store
        reorderTasks(tasksWithOrder);
      }
    } else {
      // Tasks are in different quadrants, update the task's quadrant
      const updates = getUrgencyAndImportance(overTaskQuadrant);
      
      // Find the highest order in the target quadrant
      const targetQuadrantTasks = quadrants[overTaskQuadrant];
      let highestOrder = -1;
      
      if (targetQuadrantTasks.length > 0) {
        highestOrder = Math.max(...targetQuadrantTasks.map(t => t.order ?? 0));
      }
      
      // Place the task at the end of the target quadrant
      const newOrder = highestOrder + 10;
      
      console.log(`Moving task ${taskId} from ${taskQuadrant} to ${overTaskQuadrant} with order ${newOrder}`);
      
      // Update the task with new quadrant and order
      updateTask(taskId, { ...updates, order: newOrder });
    }

    setHoveredQuadrant(null);
  };

  // Find the currently active task for the drag overlay
  const activeTask = activeId ? tasks.find(task => task.id.toString() === activeId) : null;

  return (
    <div className="eisenhower-matrix">
      <h2 className="eisenhower-matrix__title">Eisenhower Matrix</h2>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="eisenhower-matrix__grid">
          <Quadrant
            id="urgent_important"
            title="🔥 Do First (Urgent & Important)"
            tasks={quadrants.urgent_important}
            className="matrix-quadrant--urgent-important"
            onCheckTask={onCheckTask}
            onTaskEisenhowerMatrixClick={onTaskEisenhowerMatrixClick}
            isOver={hoveredQuadrant === 'urgent_important'}
            isTaskPriorityEditorOpen={isTaskPriorityEditorOpen}
            eisenhowerMatrixQuadrant="urgent_important"
            onTaskPriorityEdit={handleTaskPriorityEdit}
            editingTaskId={editingTaskId}
            isExpanded={expandedQuadrants.urgent_important}
            onToggleExpansion={toggleQuadrantExpansion}
            onTaskClick={onTaskClick}
          />

          <Quadrant
            id="not_urgent_important"
            title="🌱 Schedule (Not Urgent & Important)"
            tasks={quadrants.not_urgent_important}
            className="matrix-quadrant--not-urgent-important"
            onCheckTask={onCheckTask}
            onTaskEisenhowerMatrixClick={onTaskEisenhowerMatrixClick}
            isOver={hoveredQuadrant === 'not_urgent_important'}
            isTaskPriorityEditorOpen={isTaskPriorityEditorOpen}
            eisenhowerMatrixQuadrant="not_urgent_important"
            onTaskPriorityEdit={handleTaskPriorityEdit}
            editingTaskId={editingTaskId}
            isExpanded={expandedQuadrants.not_urgent_important}
            onToggleExpansion={toggleQuadrantExpansion}
            onTaskClick={onTaskClick}
          />

          <Quadrant
            id="urgent_not_important"
            title="🦹‍♂️ Delegate (Urgent & Not Important)"
            tasks={quadrants.urgent_not_important}
            className="matrix-quadrant--urgent-not-important"
            onCheckTask={onCheckTask}
            onTaskEisenhowerMatrixClick={onTaskEisenhowerMatrixClick}
            isOver={hoveredQuadrant === 'urgent_not_important'}
            isTaskPriorityEditorOpen={isTaskPriorityEditorOpen}
            eisenhowerMatrixQuadrant="urgent_not_important"
            onTaskPriorityEdit={handleTaskPriorityEdit}
            editingTaskId={editingTaskId}
            isExpanded={expandedQuadrants.urgent_not_important}
            onToggleExpansion={toggleQuadrantExpansion}
            onTaskClick={onTaskClick}
          />

          <Quadrant
            id="not_urgent_not_important"
            title="💀 Eliminate (Not Urgent & Not Important)"
            tasks={quadrants.not_urgent_not_important}
            className="matrix-quadrant--not-urgent-not-important"
            onCheckTask={onCheckTask}
            onTaskEisenhowerMatrixClick={onTaskEisenhowerMatrixClick}
            isOver={hoveredQuadrant === 'not_urgent_not_important'}
            isTaskPriorityEditorOpen={isTaskPriorityEditorOpen}
            eisenhowerMatrixQuadrant="not_urgent_not_important"
            onTaskPriorityEdit={handleTaskPriorityEdit}
            editingTaskId={editingTaskId}
            isExpanded={expandedQuadrants.not_urgent_not_important}
            onToggleExpansion={toggleQuadrantExpansion}
            onTaskClick={onTaskClick}
          />
        </div>

        <div className="eisenhower-matrix__uncategorized">
          <Quadrant
            id="uncategorized"
            title="Uncategorized Tasks"
            tasks={quadrants.uncategorized}
            className="matrix-quadrant--uncategorized"
            onCheckTask={onCheckTask}
            onTaskEisenhowerMatrixClick={onTaskEisenhowerMatrixClick}
            isOver={hoveredQuadrant === 'uncategorized'}
            isTaskPriorityEditorOpen={isTaskPriorityEditorOpen}
            eisenhowerMatrixQuadrant="uncategorized"
            onTaskPriorityEdit={handleTaskPriorityEdit}
            editingTaskId={editingTaskId}
            isExpanded={expandedQuadrants.uncategorized}
            onToggleExpansion={toggleQuadrantExpansion}
            onTaskClick={onTaskClick}
          />
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="task-drag-overlay">
              <div className="matrix-task-item">
                <input
                  type="checkbox"
                  checked={activeTask.isDone}
                  onChange={() => {}}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className={activeTask.isDone ? 'matrix-task-item__title--done' : ''}>
                  {activeTask.title}
                </span>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}; 