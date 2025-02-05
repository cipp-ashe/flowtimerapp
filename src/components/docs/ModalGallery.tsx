import React, { useState } from 'react';
import { EmailSummaryModal } from "@/components/EmailSummaryModal";
import { CompletionCelebration } from "@/components/timer/CompletionCelebration";
import { type Quote } from "@/types/timer/models";
import { type Task } from "@/components/tasks/TaskList";
import { type TimerStateMetrics } from "@/types/metrics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings2, Code } from "lucide-react";

export const ModalGallery: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Demo data for modals
  const demoTask: Task = {
    id: 'demo1',
    name: 'Example Task',
    completed: true,
    duration: 25,
    metrics: {
      expectedTime: 1500,
      actualDuration: 1450,
      pauseCount: 2,
      favoriteQuotes: 1,
      pausedTime: 300,
      extensionTime: 0,
      netEffectiveTime: 1150,
      efficiencyRatio: 95,
      completionStatus: 'Completed On Time'
    }
  };

  const demoTasks: Task[] = [demoTask];

  const demoQuotes: Quote[] = [
    {
      text: "Start where you are. Use what you have. Do what you can.",
      author: "Arthur Ashe",
      categories: ['motivation', 'progress']
    }
  ];

  const demoMetrics: TimerStateMetrics = {
    expectedTime: 1500,
    actualDuration: 1450,
    pauseCount: 2,
    favoriteQuotes: 1,
    pausedTime: 300,
    extensionTime: 0,
    netEffectiveTime: 1150,
    efficiencyRatio: 95,
    completionStatus: 'Completed On Time',
    isPaused: false,
    pausedTimeLeft: null,
    startTime: new Date(Date.now() - 1450000).toISOString(),
    endTime: new Date().toISOString(),
    lastPauseTimestamp: null
  };

  return (
    <section id="modals" className="space-y-8">
      <header className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-primary">Modal Gallery</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactive modal components with accessibility features and state management
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* Email Summary Modal */}
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-medium">Email Summary Modal</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Task summary email composer with metrics visualization
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Technical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Completed tasks sent directly to your email</li>
                <li>• Edge Functions via Supabase for Resend emailing</li>
                <li>• Clears completed task list on send</li>
                <li>• No data retention</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveModal('email')}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Open Email Modal
            </button>
          </div>
        </div>

        {/* Completion Celebration Modal */}
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-medium">Completion Celebration</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Task completion celebration with confetti and metrics display
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Technical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Canvas-based confetti animation</li>
                <li>• Dynamic metrics calculation</li>
                <li>• Responsive layout adaptation</li>
                <li>• Focus trap for keyboard navigation</li>
              </ul>
            </div>
            <button
              onClick={() => setActiveModal('celebration')}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Show Celebration
            </button>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="max-w-3xl mx-auto w-full">
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
                <h4 className="font-medium mb-2">Modal Architecture</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium">Email Summary Modal</h5>
                    <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`// Email Summary Modal Architecture
<Dialog>
  <DialogTrigger />
  <DialogContent>
    <MetricsDisplay />    {/* Task metrics visualization */}
    <QuotesList />        {/* Selected motivational quotes */}
    <EmailForm           {/* Form with validation */}
      onSubmit={handleEmailSend}
      validate={validateEmail}
    />
  </DialogContent>
</Dialog>`}</code>
                    </pre>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Base Dialog Component</h5>
                    <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`// Radix UI Dialog with custom styling
const Dialog = styled(RadixDialog.Root, {
  '&[data-state="open"]': {
    animation: \`\${fadeIn} 200ms ease-out\`
  },
  '&[data-state="closed"]': {
    animation: \`\${fadeOut} 200ms ease-in\`
  }
});`}</code>
                    </pre>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Focus Management</h5>
                    <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`// Custom focus trap hook
const useFocusTrap = (isOpen: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      const focusable = ref.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      // Focus trap implementation
    }
  }, [isOpen]);
  
  return ref;
};`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Animation System</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium">Modal Transitions</h5>
                    <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}`}</code>
                    </pre>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium">Confetti Animation</h5>
                    <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: random(-3, 3),
      y: random(-7, -3)
    };
  }
  // Physics simulation
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Accessibility Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Code className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-foreground">ARIA Attributes</strong>
                      <p>Proper role and state management for screen readers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Code className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-foreground">Keyboard Navigation</strong>
                      <p>Full keyboard support with focus management</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Code className="h-4 w-4 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-foreground">Motion Preferences</strong>
                      <p>Respects reduced-motion settings for animations</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Modal Instances */}
      {activeModal === 'email' && (
        <EmailSummaryModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          tasks={demoTasks}
          favorites={demoQuotes}
          metrics={demoMetrics}
        />
      )}

      {activeModal === 'celebration' && (
        <CompletionCelebration
          metrics={demoMetrics}
          onComplete={() => setActiveModal(null)}
        />
      )}
    </section>
  );
};
