import React from 'react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { cn } from '@/lib/utils';

interface TaskLayoutProps {
  timer: React.ReactNode;
  taskList: React.ReactNode;
}

export const TaskLayout = ({ timer, taskList }: TaskLayoutProps) => {
  const { isOpen: isNotesOpen } = useNotesPanel();

  return (
    <div className={cn(
      "grid grid-cols-1 gap-4 sm:gap-6",
      !isNotesOpen && "lg:grid-cols-2"
    )}>
      {/* Task List */}
      <div className="space-y-4 sm:space-y-6">
        {taskList}
      </div>

      {/* Timer Container */}
      <div className="space-y-4 sm:space-y-6">
        {timer}
      </div>
    </div>
  );
};
