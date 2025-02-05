import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Code } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ProjectOverview,
  TaskSection,
  ModalGallery,
  QuotesSection
} from "@/components/docs";

const ComponentExamples: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 p-8 text-foreground">
      {/* Navigation */}
      <div className="fixed top-4 right-4 flex items-center gap-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-primary" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </button>
        <Link
          to="/"
          className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Back to app"
        >
          <Code className="h-5 w-5 text-primary" />
        </Link>
      </div>

      <main className="max-w-6xl mx-auto space-y-16">
        {/* Project Overview with Navigation */}
        <ProjectOverview />

        {/* Task Management Section */}
        <TaskSection />

        {/* Modal Gallery */}
        <ModalGallery />

        {/* Quotes Section */}
        <QuotesSection />
      </main>
    </div>
  );
};

export default ComponentExamples;
