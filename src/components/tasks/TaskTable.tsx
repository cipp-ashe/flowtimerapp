import { useState, useCallback } from "react";
import { Task } from "./TaskList";
import { TaskRow } from "./TaskRow";

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: string[];
  onTaskClick: (task: Task, event: React.MouseEvent<HTMLDivElement>) => void;
  onTaskDelete: (taskId: string) => void;
  onTasksClear: () => void;
  onTasksUpdate?: (tasks: Task[]) => void;
}

export const TaskTable = ({
  tasks,
  selectedTasks,
  onTaskClick,
  onTaskDelete,
  onTasksClear,
  onTasksUpdate,
}: TaskTableProps) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleDurationChange = useCallback((taskId: string, newDuration: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const duration = parseInt(newDuration);
    if (isNaN(duration)) return;

    const updatedTask = { ...task, duration };
    
    // Update the task through task selection to ensure proper state updates
    onTaskClick(updatedTask, { 
      ctrlKey: false,
      stopPropagation: () => {},
      preventDefault: () => {} 
    } as React.MouseEvent<HTMLDivElement>);
    
    setEditingTaskId(null);
  }, [tasks, onTaskClick]);

    const handleDurationClick = useCallback((e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>, taskId: string) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
  }, []);

  const handleInputBlur = useCallback(() => {
    setEditingTaskId(null);
  }, []);

  return (
    <div className="mt-4 space-y-2">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          isSelected={selectedTasks.includes(task.id)}
          editingTaskId={editingTaskId}
          onTaskClick={onTaskClick}
          onTaskDelete={onTaskDelete}
          onDurationChange={handleDurationChange}
          onDurationClick={handleDurationClick}
          onInputBlur={handleInputBlur}
        />
      ))}
      
      {tasks.length > 0 && (
        <button
          onClick={onTasksClear}
          onTouchStart={onTasksClear}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors duration-200 mt-2"
        >
          Clear All
        </button>
      )}
    </div>
  );
};
