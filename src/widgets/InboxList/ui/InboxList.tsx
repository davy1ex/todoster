import { FC } from 'react';
import { Task } from '@/entities/task';
import { useTaskFiltering } from '@/features/taskFiltering';
import { TaskComponent } from '@/entities/task';
import { InputTask } from '@/entities/task/ui/InputTask/InputTask';
import { useTaskCreation } from '@/features/taskCreation';
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
  const { createTask } = useTaskCreation();
  const filteredTasks = getFilteredTasks(tasks, "Inbox");

  const handleAddTask = (title: string) => {
    createTask({
      title,
      list: "Inbox",
    });
  };

  return (
    <div className="inbox-list">
      <div className="inbox-list__title">
        <h2>Inbox</h2>
      </div>
      
      <div className="inbox-list__header">
        <InputTask listName="Inbox" onAdd={handleAddTask} />
      </div>
      
      <div className="inbox-list__tasks">
        {filteredTasks.map((task) => (
          <TaskComponent
            key={task.id}
            task={task}
            listName="Inbox"
            onCheckTask={onCheckTask}
            handleClick={() => onTaskClick(task)}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="inbox-list__empty">
            No tasks in Inbox
          </div>
        )}
      </div>
    </div>
  );
}; 