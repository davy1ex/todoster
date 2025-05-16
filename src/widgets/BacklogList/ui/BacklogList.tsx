import { FC } from 'react';
import { Task } from '@/entities/task';
import { useTaskFiltering } from '@/features/taskFiltering';
import { TaskComponent } from '@/entities/task';
import { TaskInput } from '@/features/taskCreation';
import { DateBoxTabs } from '@/entities/task';
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
        {filteredTasks.map((task) => (
          <TaskComponent
            key={task.id}
            task={task}
            listName="Backlog"
            onCheckTask={onCheckTask}
            handleClick={() => onTaskClick(task)}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="backlog-list__empty">
            No tasks in {selectedDateBox === "today" ? "today's" : selectedDateBox === "week" ? "this week's" : "later"} list
          </div>
        )}
      </div>
    </div>
  );
}; 