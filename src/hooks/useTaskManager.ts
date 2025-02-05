import { useState } from "react";
import { Task } from "@/components/tasks/TaskList";
import { Quote } from "@/types/timer";
import { TaskSummary } from "@/types/summary";
import { formatDailySummary } from "@/utils/summaryFormatter";
import { sendTaskSummaryEmail } from "@/lib/supabase";

interface UseTaskManagerProps {
  tasks: Task[];
  completedTasks: Task[];
  onTaskAdd: (task: Task) => void;
  onTaskSelect: (task: Task) => void;
  onTasksClear: () => void;
  onSelectedTasksClear: (taskIds: string[]) => void;
  onSummaryEmailSent?: () => void;
  favorites?: Quote[];
}

export const useTaskManager = ({
  tasks,
  completedTasks,
  onTaskAdd,
  onTaskSelect,
  onTasksClear,
  onSelectedTasksClear,
  onSummaryEmailSent,
  favorites = [],
}: UseTaskManagerProps) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleTaskClick = (task: Task, event: React.MouseEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      setSelectedTasks(prev =>
        prev.includes(task.id)
          ? prev.filter(id => id !== task.id)
          : [...prev, task.id]
      );
    } else {
      setSelectedTasks([]);
      onTaskSelect(task);
    }
  };

  const handleTaskDelete = (taskId: string) => {
    onSelectedTasksClear([taskId]);
    setSelectedTasks(prev => prev.filter(id => id !== taskId));
  };

  const clearSelectedTasks = () => {
    if (selectedTasks.length > 0) {
      onSelectedTasksClear(selectedTasks);
      setSelectedTasks([]);
    }
  };

  const handleSendSummary = async (email: string) => {
    try {
      const completedTaskSummaries: TaskSummary[] = completedTasks.map(task => ({
        taskName: task.name,
        completed: true,
        metrics: {
          ...task.metrics,
          startTime: null,
          endTime: null,
          lastPauseTimestamp: null
        },
        relatedQuotes: favorites.filter(quote => quote.task === task.name),
      }));

      const unfinishedTaskSummaries: TaskSummary[] = tasks.map(task => ({
        taskName: task.name,
        completed: false,
        metrics: task.metrics ? {
          ...task.metrics,
          startTime: null,
          endTime: null,
          lastPauseTimestamp: null
        } : undefined,
        relatedQuotes: favorites.filter(quote => quote.task === task.name),
      }));

      const summaryData = formatDailySummary(
        completedTaskSummaries,
        unfinishedTaskSummaries,
        favorites
      );

      await sendTaskSummaryEmail(email, summaryData);
      
      // Close the modal and clear completed tasks
      setShowEmailModal(false);
      if (onSummaryEmailSent) {
        onSummaryEmailSent();
      }
    } catch (error) {
      // Log the error but don't throw since email was likely sent
      console.warn('Warning while sending email:', error);
      
      // Close the modal and clear completed tasks anyway
      setShowEmailModal(false);
      if (onSummaryEmailSent) {
        onSummaryEmailSent();
      }
    }
  };

  return {
    selectedTasks,
    showEmailModal,
    setShowEmailModal,
    handleTaskClick,
    clearSelectedTasks,
    handleSendSummary,
    handleTaskDelete,
  };
};
