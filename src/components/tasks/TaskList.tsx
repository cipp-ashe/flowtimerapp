import { TaskInput } from "./TaskInput";
import { TaskTable } from "./TaskTable";
import { CompletedTasks } from "../CompletedTasks";
import { EmailSummaryModal } from "../EmailSummaryModal";
import { Quote } from "@/types/timer";
import { useTaskManager } from "@/hooks/useTaskManager";

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  duration?: number;
  metrics?: {
    expectedTime: number;
    actualDuration: number;
    pauseCount: number;
    favoriteQuotes: number;
    pausedTime: number;
    extensionTime: number;
    netEffectiveTime: number;
    efficiencyRatio: number;
    completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
  };
}

interface TaskListProps {
  tasks: Task[];
  completedTasks: Task[];
  onTaskAdd: (task: Task) => void;
  onTaskSelect: (task: Task, event?: React.MouseEvent<HTMLDivElement>) => void;
  onTasksClear: () => void;
  onSelectedTasksClear?: (taskIds: string[]) => void;
  onSummaryEmailSent?: () => void;
  onTasksUpdate?: (tasks: Task[]) => void;
  favorites?: Quote[];
}

export const TaskList = ({
  tasks,
  completedTasks,
  onTaskAdd,
  onTaskSelect,
  onTasksClear,
  onSelectedTasksClear,
  onSummaryEmailSent,
  favorites = [],
  onTasksUpdate,
}: TaskListProps) => {
  const {
    selectedTasks,
    showEmailModal,
    setShowEmailModal,
    handleTaskClick,
    clearSelectedTasks,
    handleSendSummary,
    handleTaskDelete,
  } = useTaskManager({
    tasks,
    completedTasks,
    onTaskAdd,
    onTaskSelect,
    onTasksClear,
    onSelectedTasksClear: onSelectedTasksClear!,
    onSummaryEmailSent,
    favorites,
  });

  return (
    <div className="space-y-4">
      <TaskInput onTaskAdd={onTaskAdd} />
      
      <TaskTable
        tasks={tasks}
        selectedTasks={selectedTasks}
        onTaskClick={handleTaskClick}
        onTaskDelete={handleTaskDelete}
        onTasksClear={selectedTasks.length > 0 ? clearSelectedTasks : onTasksClear}
        onTasksUpdate={onTasksUpdate}
      />

      <CompletedTasks 
        tasks={completedTasks} 
        onSendSummary={() => setShowEmailModal(true)} 
      />

      <EmailSummaryModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleSendSummary}
      />
    </div>
  );
};
