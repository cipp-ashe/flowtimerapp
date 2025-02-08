import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { TaskManager } from "@/components/tasks/TaskManager";
import { Moon, Sun, Code2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";
import { Timer } from "@/components/timer/Timer";

interface IndexProps {
  cornerMode?: boolean;
}

const Index = ({ cornerMode = false }: IndexProps) => {
  const { isDark, toggleTheme } = useTheme(true);
  // Only use NotesPanel when not in corner mode
  const notesPanel = !cornerMode ? useNotesPanel() : { toggle: () => {} };

  // Load initial tasks from localStorage
  const [initialTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('taskList');
      if (!saved) return [];
      
      // Try to sanitize the JSON string before parsing
      const sanitized = saved.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      const parsed = JSON.parse(sanitized);
      
      // Validate the parsed data is an array
      if (!Array.isArray(parsed)) {
        console.error('Invalid tasks format');
        localStorage.removeItem('taskList');
        return [];
      }
      
      // Sanitize task data
      const sanitizedTasks = parsed.map(task => ({
        ...task,
        name: task.name?.replace(/[\u0000-\u001F\u007F-\u009F]/g, '') || 'Untitled Task',
        duration: typeof task.duration === 'number' ? task.duration : 25
      }));
      
      return sanitizedTasks;
    } catch (error) {
      console.error('Error loading tasks:', error);
      // Clear corrupted data
      localStorage.removeItem('taskList');
      return [];
    }
  });

  const [initialCompletedTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('completedTasks');
      if (!saved) return [];
      
      // Try to sanitize the JSON string before parsing
      const sanitized = saved.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      const parsed = JSON.parse(sanitized);
      
      // Validate the parsed data is an array
      if (!Array.isArray(parsed)) {
        console.error('Invalid completed tasks format');
        localStorage.removeItem('completedTasks');
        return [];
      }
      
      return parsed;
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      // Clear corrupted data
      localStorage.removeItem('completedTasks');
      return [];
    }
  });

  const [favorites, setFavorites] = useState<Quote[]>(() => {
    try {
      const saved = localStorage.getItem('favoriteQuotes');
      return saved && saved !== "undefined" ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading favorite quotes:', error);
      return [];
    }
  });

  // Handle task updates
  const handleTasksUpdate = (tasks: Task[]) => {
    try {
      const sanitizedTasks = tasks.map(task => ({
        ...task,
        name: task.name?.replace(/[\u0000-\u001F\u007F-\u009F]/g, '') || 'Untitled Task',
        duration: typeof task.duration === 'number' ? task.duration : 25
      }));
      localStorage.setItem('taskList', JSON.stringify(sanitizedTasks));
      window.dispatchEvent(new CustomEvent('tasksUpdated', { detail: { tasks: sanitizedTasks } }));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const handleCompletedTasksUpdate = (tasks: Task[]) => {
    try {
      const sanitizedTasks = tasks.map(task => ({
        ...task,
        name: task.name.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''),
        duration: typeof task.duration === 'number' ? task.duration : 25
      }));
      localStorage.setItem('completedTasks', JSON.stringify(sanitizedTasks));
    } catch (error) {
      console.error('Error saving completed tasks:', error);
    }
  };

  // Handle favorites updates
  const handleFavoritesUpdate = (newFavorites: Quote[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
  };

  // In corner mode, only render the timer for the current task
  if (cornerMode && initialTasks.length > 0) {
    const currentTask = initialTasks[0];
    return (
      <Timer
        duration={currentTask.duration ? currentTask.duration * 60 : 1500}
        taskName={currentTask.name}
        onComplete={() => {
          // Handle task completion in corner mode
          const updatedTasks = initialTasks.slice(1);
          handleTasksUpdate(updatedTasks);
          window.electron.exitCornerMode();
        }}
        onAddTime={() => {}}
        favorites={favorites}
        setFavorites={handleFavoritesUpdate}
        cornerMode={cornerMode}
      />
    );
  }

  // If in corner mode but no tasks, show a message
  if (cornerMode) {
    return (
      <div className="h-screen flex items-center justify-center text-foreground">
        No active tasks
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="flex pt-6 justify-between items-center mb-4 sm:mb-7">
          <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Focus Timer
          </h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={notesPanel.toggle}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle Notes"
            >
              <StickyNote className="h-5 w-5" />
            </button>
            <Link 
              to="/components" 
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Developer Documentation"
            >
              <Code2 className="h-5 w-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/20"
            >
              {isDark ? (
                <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>

        <TaskManager
          initialTasks={initialTasks}
          initialCompletedTasks={initialCompletedTasks}
          initialFavorites={favorites}
          onTasksUpdate={handleTasksUpdate}
          onCompletedTasksUpdate={handleCompletedTasksUpdate}
          onFavoritesChange={handleFavoritesUpdate}
        />
      </div>
    </div>
  );
};

export default Index;
