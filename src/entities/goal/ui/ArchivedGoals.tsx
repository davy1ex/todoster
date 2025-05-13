import { FC } from 'react';
import { goalStore } from '../model/store';
import { Goal } from '../model/types';
import { formatDistanceToNow } from 'date-fns';

const formatArchiveDate = (date: Date | undefined) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Unknown date';
  }
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const ArchivedGoals: FC = () => {
  const archivedGoals = goalStore((state) => state.archivedGoals);
  const { unarchiveGoal, deleteGoal } = goalStore();

  if (archivedGoals.length === 0) {
    return <div className="text-center text-gray-500 mt-4">No archived goals</div>;
  }

  return (
    <div className="archived-goals">
      <h2 className="text-xl font-semibold mb-4">Archived Goals</h2>
      <div className="space-y-4">
        {archivedGoals.map((goal: Goal) => (
          <div
            key={goal.id}
            className="archived-goal bg-background-alt p-4 rounded-lg border border-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{goal.title}</h3>
                <p className="text-text-light text-sm">{goal.description}</p>
                <div className="text-text-lighter text-xs mt-1">
                  Archived {formatArchiveDate(goal.archivedAt)}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => unarchiveGoal(goal.id)}
                  className="text-primary hover:text-primary-hover transition-colors"
                  title="Restore goal"
                >
                  ↩️
                </button>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-error hover:text-error-hover transition-colors"
                  title="Delete permanently"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center space-x-2 text-sm">
              {goal.projectId && (
                <>
                  <span className="text-text-light">Project ID: {goal.projectId}</span>
                  <span className="text-text-light">•</span>
                </>
              )}
              <span className="text-text-light">Priority: {goal.priority}</span>
              <span className="text-text-light">•</span>
              <span className={`${goal.isCompleted ? 'text-success' : 'text-warning'}`}>
                {goal.isCompleted ? 'Completed' : 'Incomplete'}
              </span>
              {goal.deadline && (
                <>
                  <span className="text-text-light">•</span>
                  <span className="text-text-light">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 