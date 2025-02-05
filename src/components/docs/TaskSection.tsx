import React, { useState } from 'react';
import { TaskInput } from "@/components/tasks/TaskInput";
import TaskRow from "@/components/tasks/TaskRow";
import { TimerCircle } from "@/components/timer/TimerCircle";
import { type Task } from "@/components/tasks/TaskList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings2, ArrowRight, Heart } from "lucide-react";

export const TaskSection: React.FC = () => {
  const [demoTask, setDemoTask] = useState<Task>({
    id: 'demo1',
    name: 'Example Task',
    completed: false,
    duration: 25
  });
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(demoTask.duration * 60);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const completedTasks: Task[] = [
    {
      id: 'completed1',
      name: 'Write Documentation',
      completed: true,
      duration: 25,
      metrics: { expectedTime: 1500, actualDuration: 1450, pauseCount: 2, favoriteQuotes: 1, pausedTime: 300, extensionTime: 0, netEffectiveTime: 1150, efficiencyRatio: 95, completionStatus: 'Completed On Time' }
    },
    // Add more completed tasks as needed
  ];

  const demoLikedQuotes = [
    "Start where you are. Use what you have. Do what you can.",
    "The secret of getting ahead is getting started.",
    "Small progress is still progress.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
  ];

  return (
    <section id="tasks" className="space-y-8 max-w-4xl mx-auto">
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-primary">Task Management</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A complete task management system with real-time updates, drag-and-drop ordering,
          and productivity metrics tracking.
        </p>
      </header>

      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden mb-8 max-w-4xl mx-auto">
        <div className="p-8 space-y-8">
          {/* Interactive Task Demo */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 inline-flex items-center justify-center text-primary">1</span>
                Create a Task in single or bulk mode.
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <TaskInput
                  onTaskAdd={(task) => {
                    setDemoTask(task);
                    setTimeLeft(task.duration * 60);
                  }}
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Adding tasks in bulk mode allows you to define estimated time using commas and new lines. Try it out.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 inline-flex items-center justify-center text-primary">2</span>
                Manage Task
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <TaskRow
                  task={demoTask}
                  onSelect={() => {}}
                  onUpdate={(updatedTask) => {
                    setDemoTask(updatedTask);
                    setTimeLeft(updatedTask.duration * 60);
                  }}
                  isSelected={false}
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Users are able to edit the estimated amount of time in their active task list. Default for single line entries is 25 mins.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 inline-flex items-center justify-center text-primary">3</span>
                Track Progress
              </h3>
              <div className="bg-muted/30 p-4 rounded-lg flex justify-center">
                <TimerCircle 
                  size="large"
                  isRunning={isTimerRunning}
                  timeLeft={timeLeft}
                  minutes={demoTask.duration}
                  circumference={282.74}
                  a11yProps={{
                    "aria-label": `Timer showing ${Math.floor(timeLeft / 60)} minutes and ${timeLeft % 60} seconds remaining`,
                    "aria-valuemax": demoTask.duration * 60,
                    "aria-valuenow": timeLeft,
                    role: "timer"
                  }}
                />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {isTimerRunning ? 'Pause' : 'Start'} Timer
                </button>
                <button
                  onClick={() => setTimeLeft(demoTask.duration * 60)}
                  className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  Reset Timer
                </button>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="flow">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  <span>Task Flow Explanation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Task Lifecycle</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-primary mb-2">1. Creation</h5>
                        <p className="text-sm text-muted-foreground">Tasks are created with a name and duration. The system validates input and prepares the timer.</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-primary mb-2">2. Execution</h5>
                        <p className="text-sm text-muted-foreground">Timer tracks progress, handles pauses, and manages extensions. Quotes provide motivation.</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h5 className="text-sm font-medium text-primary mb-2">3. Completion</h5>
                        <p className="text-sm text-muted-foreground">Tasks are marked complete, metrics are calculated, and summaries can be emailed.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="liked-quotes">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>Motivational Quotes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-3">Liked Quotes</h4>
                    <div className="space-y-3">
                      {demoLikedQuotes.map(quote => (
                        <div key={quote} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                          <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{quote}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="completed">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <span>Completed Tasks</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  <div className="bg-muted/30 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="p-3 text-left">Task Name</th>
                          <th className="p-3 text-left">Duration</th>
                          <th className="p-3 text-left">Efficiency</th>
                          <th className="p-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedTasks.map(task => (
                          <tr key={task.id} className="border-t border-border/50">
                            <td className="p-3">{task.name}</td>
                            <td className="p-3">{task.duration} min</td>
                            <td className="p-3">{task.metrics?.efficiencyRatio}%</td>
                            <td className="p-3">{task.metrics?.completionStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="technical">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <span>Technical Implementation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 p-4">
                  <div>
                    <h4 className="font-medium mb-2">Component Architecture</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      The task management system uses a compound component pattern for flexibility and reusability:
                    </p>
                    <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`// Task Management System
<TaskManager>
  <TaskInput />           {/* Task creation with validation */}
  <TaskList>             {/* Task list container */}
    <TaskRow />          {/* Individual task items */}
    <TaskMetrics />      {/* Progress tracking */}
  </TaskList>
  <TimerIntegration />   {/* Timer synchronization */}
</TaskManager>`}</code>
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key CSS Classes Explained</h4>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <code className="text-sm bg-muted/30 px-2 py-1 rounded">bg-gradient-to-br</code>
                          <p className="text-sm text-muted-foreground mt-1">
                            Creates a subtle gradient from top-left to bottom-right
                          </p>
                        </div>
                        <div>
                          <code className="text-sm bg-muted/30 px-2 py-1 rounded">hover:bg-primary/90</code>
                          <p className="text-sm text-muted-foreground mt-1">
                            Slightly darkens the primary color on hover
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-primary/10 inline-flex items-center justify-center text-primary text-xs mt-0.5">✓</span>
                        <div>
                          <strong className="text-foreground">Real-time Updates</strong>
                          <p>Task changes immediately reflect in the timer display</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-primary/10 inline-flex items-center justify-center text-primary text-xs mt-0.5">✓</span>
                        <div>
                          <strong className="text-foreground">Accessibility</strong>
                          <p>Full keyboard navigation and ARIA attributes</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-primary/10 inline-flex items-center justify-center text-primary text-xs mt-0.5">✓</span>
                        <div>
                          <strong className="text-foreground">Type Safety</strong>
                          <p>Full TypeScript support with strict type checking</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};