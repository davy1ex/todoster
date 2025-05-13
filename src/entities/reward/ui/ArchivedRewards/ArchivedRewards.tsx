import { FC } from 'react';
import { rewardStore } from '../../model/store';
import { Reward } from '../../model/types';
import { formatDistanceToNow } from 'date-fns';
import './ArchivedRewards.css';

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

export const ArchivedRewards: FC = () => {
  const archivedRewards = rewardStore((state) => state.archivedRewards);
  const { unarchiveReward, deleteReward } = rewardStore();

  if (archivedRewards.length === 0) {
    return <div className="text-center text-gray-500 mt-4">No archived rewards</div>;
  }

  return (
    <div className="archived-rewards">
      <h2 className="text-xl font-semibold mb-4">Archived Rewards</h2>
      <div className="space-y-4">
        {archivedRewards.map((reward: Reward) => (
          <div
            key={reward.id}
            className="archived-reward bg-background-alt p-4 rounded-lg border border-border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{reward.title}</h3>
                <div className="text-text-light text-sm">Cost: {reward.cost} coins</div>
                <div className="text-text-lighter text-xs mt-1">
                  Archived {formatArchiveDate(reward.archivedAt)}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => unarchiveReward(reward.id)}
                  className="text-primary hover:text-primary-hover transition-colors"
                  title="Restore reward"
                >
                  ↩️
                </button>
                <button
                  onClick={() => deleteReward(reward.id)}
                  className="text-error hover:text-error-hover transition-colors"
                  title="Delete permanently"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 