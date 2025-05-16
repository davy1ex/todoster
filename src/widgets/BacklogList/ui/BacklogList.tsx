import { FC } from 'react';
import { Task } from '@/entities/task';
import { useTaskFiltering } from '@/features/taskFiltering';
import { TaskComponent } from '@/entities/task';
import { InputTask } from '@/entities/task';
import { DateBoxTabs } from '@/entities/task';
import { useTaskCreation } from '@/features/taskCreation';
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
  
  const { createTask } = useTaskCreation();
  const filteredTasks = getFilteredTasks(tasks, "Backlog");
  const taskCounts = getTaskCounts(tasks);

  const handleAddTask = (title: string) => {
    createTask({
      title,
      list: "Backlog",
      date_box: selectedDateBox,
    });
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
        <InputTask listName="Backlog" onAdd={handleAddTask} />
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