import { FC } from 'react';
import { DateBox } from '../../model/type';
import './DateBoxTabs.css';

interface DateBoxTabsProps {
  selectedDateBox: DateBox;
  onSelect: (dateBox: DateBox) => void;
  taskCounts: {
    today: number;
    week: number;
    later: number;
  };
}

export const DateBoxTabs: FC<DateBoxTabsProps> = ({
  selectedDateBox,
  onSelect,
  taskCounts,
}) => {
  const tabs: { id: DateBox; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'later', label: 'Later' },
  ];

  return (
    <div className="date-box-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`date-box-tab ${selectedDateBox === tab.id ? 'date-box-tab--active' : ''}`}
          onClick={() => onSelect(tab.id)}
        >
          {tab.label}
          <span className="date-box-tab__count">{taskCounts[tab.id]}</span>
        </button>
      ))}
    </div>
  );
}; 