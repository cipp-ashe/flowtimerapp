import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import { TaskManager } from "@/components/tasks/TaskManager";
import { Moon, Sun, Code2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNotesPanel } from "@/hooks/useNotesPanel";
import type { Task } from "@/components/tasks/TaskList";
import type { Quote } from "@/types/timer";

const Index = () => {
  const { isDark, toggleTheme } = useTheme(true);
  const { toggle: toggleNotes } = useNotesPanel();

  // Load initial tasks from localStorage
  const [initialTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('taskList');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  });

  const [initialCompletedTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('completedTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading completed tasks:', error);
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
    localStorage.setItem('taskList', JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('tasksUpdated', { detail: { tasks } }));
  };

  const handleCompletedTasksUpdate = (tasks: Task[]) => {
    localStorage.setItem('completedTasks', JSON.stringify(tasks));
  };

  // Handle favorites updates
  const handleFavoritesUpdate = (newFavorites: Quote[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="flex justify-between items-center mb-4 sm:mb-7">
          <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Focus Timer
          </h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleNotes}
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
