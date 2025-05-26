/**
 * @file: TaskPriorityEditor.tsx
 * @description: Component for editing task urgency and importance
 * @dependencies: entities/task
 * @created: 2023-11-25
 */
import { FC } from 'react';
import { Task, taskStore, UrgencyLevel, ImportanceLevel } from '@/entities/task';
import './TaskPriorityEditor.css';

interface TaskPriorityEditorProps {
  task: Task;
}

export const TaskPriorityEditor: FC<TaskPriorityEditorProps> = ({ task }) => {
  const updateTask = taskStore((state) => state.updateTask);
  
  const handleUrgencyChange = (urgency: UrgencyLevel) => {
    updateTask(task.id, { urgent: urgency });
  };
  
  const handleImportanceChange = (importance: ImportanceLevel) => {
    updateTask(task.id, { important: importance });
  };
  
  return (
    <div className="task-priority-editor">
      <div className="task-priority-editor__section">
        <h4 className="task-priority-editor__label">Urgency:</h4>
        <div className="task-priority-editor__buttons">
          <button 
            className={`task-priority-editor__button ${task.urgent === 'urgent' ? 'task-priority-editor__button--active' : ''}`}
            onClick={() => handleUrgencyChange('urgent')}
          >
            Urgent
          </button>
          <button 
            className={`task-priority-editor__button ${task.urgent === 'not urgent' ? 'task-priority-editor__button--active' : ''}`}
            onClick={() => handleUrgencyChange('not urgent')}
          >
            Not Urgent
          </button>
          <button 
            className={`task-priority-editor__button ${task.urgent === null ? 'task-priority-editor__button--active' : ''}`}
            onClick={() => handleUrgencyChange(null)}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div className="task-priority-editor__section">
        <h4 className="task-priority-editor__label">Importance:</h4>
        <div className="task-priority-editor__buttons">
          <button 
            className={`task-priority-editor__button ${task.important === 'important' ? 'task-priority-editor__button--active' : ''}`}
            onClick={() => handleImportanceChange('important')}
          >
            Important
          </button>
          <button 
            className={`task-priority-editor__button ${task.important === 'not important' ? 'task-priority-editor__button--active' : ''}`}
            onClick={() => handleImportanceChange('not important')}
          >
            Not Important
          </button>
          <button 
            className={`task-priority-editor__button ${task.important === null ? 'task-priority-editor__button--active' : ''}`}
            onClick={() => handleImportanceChange(null)}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}; 