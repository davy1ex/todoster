import { FC } from 'react';
import { taskStore } from '../model/store';
import { Task } from '../model/type';
import { formatDistanceToNow } from 'date-fns';

export const ArchivedTasks: FC = () => {
  const archivedTasks = taskStore((state) => state.archivedTasks);
  const { unarchiveTask, deleteTask } = taskStore();

  if (archivedTasks.length === 0) {
    return <div className="text-center text-gray-500 mt-4">No archived tasks</div>;
  }

  return (
    <div className="archived-tasks">
      <h2 className="text-xl font-semibold mb-4">Archived Tasks</h2>
      <div className="space-y-4">
        {archivedTasks.map((task: Task) => (
          <div
            key={task.id}
            className="archived-task bg-background-alt p-4 rounded-lg border border-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{task.title}</h3>
                <p className="text-text-light text-sm">{task.description}</p>
                <div className="text-text-lighter text-xs mt-1">
                  Archived {formatDistanceToNow(task.archivedAt || new Date(), { addSuffix: true })}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => unarchiveTask(task.id)}
                  className="text-primary hover:text-primary-hover transition-colors"
                  title="Restore task"
                >
                  ↩️
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-error hover:text-error-hover transition-colors"
                  title="Delete permanently"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-sm">
              <span className="text-text-light">List: {task.list}</span>
              <span className="text-text-light">•</span>
              <span className="text-text-light">
                Reward: {task.reward} coins
              </span>
              <span className="text-text-light">•</span>
              <span className={`${task.isDone ? 'text-success' : 'text-warning'}`}>
                {task.isDone ? 'Completed' : 'Incomplete'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 