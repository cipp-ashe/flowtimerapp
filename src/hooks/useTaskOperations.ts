import { useState, useCallback } from "react";
import { Task } from "@/components/tasks/TaskList";
import { Quote } from "@/types/timer";
import { TimerStateMetrics } from "@/types/metrics";
import { toast } from "sonner";

export const useTaskOperations = ({
  initialTasks = [],
  initialCompletedTasks = [],
  onTasksUpdate,
  onCompletedTasksUpdate,
}: {
  initialTasks?: Task[];
  initialCompletedTasks?: Task[];
  onTasksUpdate?: (tasks: Task[]) => void;
  onCompletedTasksUpdate?: (tasks: Task[]) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(initialCompletedTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskAdd = useCallback((task: Task) => {
    console.log('Adding new task:', {
      taskId: task.id,
      taskName: task.name,
      duration: task.duration
    });
    
    setTasks(prev => {
      const newTasks = [...prev, task];
      console.log('Updated task list:', newTasks.map(t => ({ id: t.id, name: t.name })));
      onTasksUpdate?.(newTasks);
      return newTasks;
    });

    toast.success("Task added 📝✨");
  }, [onTasksUpdate]);

  const handleTaskSelect = useCallback((task: Task, event?: React.MouseEvent) => {
    // Only handle selection if it's not a ctrl+click
    if (event?.ctrlKey) return;

    // Find existing task to preserve any existing properties
    const existingTask = tasks.find(t => t.id === task.id);
    if (!existingTask) return;

    // Create updated task with all properties
    const updatedTask = { ...existingTask, ...task };

    // Always update task list to ensure state is in sync
    setTasks(prev => {
      const updatedTasks = prev.map(t => 
        t.id === task.id ? updatedTask : t
      );
      onTasksUpdate?.(updatedTasks);
      return updatedTasks;
    });

    // Always update selection to ensure timer gets latest task state
    setSelectedTask(updatedTask);
    
    // Only show toast if it's a selection, not a duration update
    if (!task.duration || task.duration === existingTask.duration) {
      toast(task.name);
    }
  }, [tasks, onTasksUpdate]);

  const handleTaskComplete = useCallback((metrics: TimerStateMetrics) => {
    console.log('Completing task:', {
      selectedTask: selectedTask?.name,
      metrics: metrics
    });
    
    if (!selectedTask) {
      console.error('No task selected for completion');
      return;
    }
    
    setCompletedTasks(prev => {
      const newCompleted = [...prev, {
        ...selectedTask,
        completed: true,
        metrics: metrics
      }];
      console.log('Updated completed tasks list:', 
        newCompleted.map(t => ({ id: t.id, name: t.name }))
      );
      onCompletedTasksUpdate?.(newCompleted);
      return newCompleted;
    });
    
    setTasks(prev => {
      const newTasks = prev.filter(t => t.id !== selectedTask.id);
      console.log('Removed completed task from active tasks');
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    setSelectedTask(null);
    toast.success("Task Complete 🎯✨");
  }, [selectedTask, onTasksUpdate, onCompletedTasksUpdate]);

  const handleTasksClear = useCallback(() => {
    console.log('Clearing all tasks');
    setTasks([]);
    onTasksUpdate?.([]);
    toast("Tasks cleared 🗑️");
  }, [onTasksUpdate]);

  const handleSelectedTasksClear = useCallback((taskIds: string[]) => {
    console.log('Clearing selected tasks:', taskIds);
    
    setTasks(prev => {
      const newTasks = prev.filter(task => !taskIds.includes(task.id));
      console.log('Remaining tasks after clear:', 
        newTasks.map(t => ({ id: t.id, name: t.name }))
      );
      onTasksUpdate?.(newTasks);
      return newTasks;
    });
    
    if (selectedTask && taskIds.includes(selectedTask.id)) {
      console.log('Currently selected task was cleared, resetting selection');
      setSelectedTask(null);
    }

    toast(`${taskIds.length} task${taskIds.length === 1 ? '' : 's'} removed 🗑️`);
  }, [selectedTask, onTasksUpdate]);

  return {
    tasks,
    setTasks,
    completedTasks,
    setCompletedTasks,
    selectedTask,
    handleTaskAdd,
    handleTaskSelect,
    handleTaskComplete,
    handleTasksClear,
    handleSelectedTasksClear,
  };
};
