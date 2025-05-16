import { FC, useState } from 'react';
import { taskStore } from '../../model/store';
import { TaskComponent } from '../TaskComponent/TaskComponent';
import { DateBoxTabs } from '../DateBoxTabs/DateBoxTabs';
// import { TaskModal } from '../TaskModal/TaskModal';
import type { DateBox, Task } from '../../model/type';
import './TaskList.css';

interface TaskListProps {
  title?: string;
  listType?: 'backlog' | 'inbox';
}

export const TaskList: FC<TaskListProps> = ({ title = "Tasks", listType = 'inbox' }) => {
  const [selectedDateBox, setSelectedDateBox] = useState<DateBox>("today");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const tasks = taskStore((state) => state.tasks);
  const getTasksByDateBox = taskStore((state) => state.getTasksByDateBox);
  const checkTask = taskStore((state) => state.checkTask);

  const taskCounts = {
    today: tasks.filter(task => task.date_box === "today").length,
    week: tasks.filter(task => task.date_box === "week").length,
    later: tasks.filter(task => task.date_box === "later").length,
    backlog: tasks.filter(task => task.date_box.toLowerCase() === "backlog").length,
  };

  const getFilteredTasks = () => {
    if (listType === 'backlog') {
      return getTasksByDateBox(selectedDateBox);
    }
    // For inbox or other lists, return all tasks
    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="task-list">
      <div className="task-list__header">
        <h2>{title}</h2>
        {listType === 'backlog' && (
          <DateBoxTabs
            selectedDateBox={selectedDateBox}
            onSelect={setSelectedDateBox}
            taskCounts={taskCounts}
          />
        )}
      </div>
      <div className="task-list__content">
        {filteredTasks.map((task) => (
          <TaskComponent
            key={task.id}
            task={task}
            listName={listType}
            onCheckTask={checkTask}
            handleClick={() => setSelectedTask(task)}
          />
        ))}
        {filteredTasks.length === 0 && (
          <div className="task-list__empty">
            {listType === 'backlog' 
              ? `No tasks in ${selectedDateBox === "today" ? "today's" : selectedDateBox === "week" ? "this week's" : "later"} list`
              : 'No tasks in this list'
            }
          </div>
        )}
      </div>
      {/* {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )} */}
    </div>
  );
}; 