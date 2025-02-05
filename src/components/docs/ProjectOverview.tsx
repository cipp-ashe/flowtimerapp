import React from 'react';
import { List, Quote as QuoteIcon, Package, Layers, Code, Settings2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NavigationItem {
  icon: React.ComponentType;
  label: string;
  href: string;
}

const navigation: NavigationItem[] = [
  { icon: List, label: "Task Management", href: "#tasks" },
  { icon: Layers, label: "Modal Gallery", href: "#modalgallery" },
  { icon: QuoteIcon, label: "Motivational Quotes", href: "#quotes" }
];

export const ProjectOverview: React.FC = () => {
  return (
    <section>
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          Interactive Component Gallery
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore and interact with the core components that power the application.
          Each component includes live demos, technical details, and customization options.
        </p>
      </div>

      <div className="max-w-3xl mx-auto my-12">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      </div>

      {/* Component Configuration Section */}
      <div className="mt-12 max-w-3xl mx-auto space-y-8">
        {/* Package Details */}
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Project Package Details</h3>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Core Dependencies</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-primary">UI Framework</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• React 18.2.0</li>
                    <li>• Radix UI Components</li>
                    <li>• Tailwind CSS 3.4.17</li>
                    <li>• Lucide React Icons</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-primary">State Management</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• React Query 5.17</li>
                    <li>• React Hook Form 7.49</li>
                    <li>• Zod Validation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Development Tools</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-primary">Build Tools</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• Vite 5.0</li>
                    <li>• TypeScript 5.3</li>
                    <li>• PostCSS 8.5</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-primary">Testing</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• Jest 29.7</li>
                    <li>• React Testing Library</li>
                    <li>• Testing Library Hooks</li>
                    <li>• MSW (API Mocking)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Architecture Overview</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-primary">Core Features</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• Timer System with Metrics</li>
                    <li>• Task Management</li>
                    <li>• Quote Management</li>
                    <li>• Email Summaries</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-primary">State Management</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• Custom React Hooks</li>
                    <li>• React Query for API Data</li>
                    <li>• Supabase Integration</li>
                    <li>• Local Storage Persistence</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Component Architecture</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-primary">Timer Components</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• Timer Display & Controls</li>
                    <li>• Timer Metrics & Statistics</li>
                    <li>• Completion Celebration</li>
                    <li>• Sound Management</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-primary">Task Components</h5>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <li>• Task List & Table Views</li>
                    <li>• Task Input & Management</li>
                    <li>• Completed Tasks Display</li>
                    <li>• Email Summary Modal</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Hooks & Utilities */}
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="hooks-helper">
              <AccordionTrigger className="px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Custom Hooks & Utilities</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Timer Hooks</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <ul className="space-y-2 text-sm">
                          <li><strong>useTimer:</strong> Core timer functionality and state management</li>
                          <li><strong>useTimerMetrics:</strong> Timer statistics and metrics tracking</li>
                          <li><strong>useTimerControls:</strong> Timer control operations</li>
                          <li><strong>useAudio:</strong> Sound effect management for timer events</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Task Management Hooks</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <ul className="space-y-2 text-sm">
                          <li><strong>useTaskManager:</strong> Central task state management</li>
                          <li><strong>useTaskOperations:</strong> Task CRUD operations</li>
                          <li><strong>useMinutesHandlers:</strong> Time input handling</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-3">UI & Utility Hooks</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <ul className="space-y-2 text-sm">
                          <li><strong>useTheme:</strong> Theme management</li>
                          <li><strong>useTransition:</strong> Animation transitions</li>
                          <li><strong>useFocusTrap:</strong> Accessibility focus management</li>
                          <li><strong>useWindowSize:</strong> Responsive design helper</li>
                          <li><strong>useLoadingState:</strong> Loading state management</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Tailwind CSS Helper */}
        <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="css-helper">
              <AccordionTrigger className="px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">CSS Helper Reference</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Layout Classes</h4>
                      <div className="bg-muted/30 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="p-3 text-left">Class</th>
                              <th className="p-3 text-left">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">grid grid-cols-1 md:grid-cols-3</td>
                              <td className="p-3">Single column layout on mobile, 3 columns on medium screens and up</td>
                            </tr>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">max-w-3xl mx-auto</td>
                              <td className="p-3">Maximum width of 48rem (768px) with horizontal centering</td>
                            </tr>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">space-y-4</td>
                              <td className="p-3">Adds 1rem (16px) vertical spacing between child elements</td>
                            </tr>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">gap-4</td>
                              <td className="p-3">Adds 1rem (16px) gap between grid/flex items</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Styling Classes</h4>
                      <div className="bg-muted/30 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="p-3 text-left">Class</th>
                              <th className="p-3 text-left">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">bg-gradient-to-br from-card to-card/95</td>
                              <td className="p-3">Gradient background from top-left to bottom-right</td>
                            </tr>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">text-muted-foreground</td>
                              <td className="p-3">Slightly muted text color for secondary content</td>
                            </tr>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">hover:bg-primary/90</td>
                              <td className="p-3">Slightly darker primary color on hover (90% opacity)</td>
                            </tr>
                            <tr className="border-t border-border/50">
                              <td className="p-3 font-mono text-xs">transition-colors duration-300</td>
                              <td className="p-3">Smooth color transitions over 300ms</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> These classes are part of the Tailwind CSS framework. The{' '}
                      <code className="text-xs bg-muted/30 px-1.5 py-0.5 rounded">md:</code> prefix indicates 
                      styles that apply at the medium breakpoint (768px) and above.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Navigation */}
        <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {navigation.map(({ icon: Icon, label, href }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-lg bg-card hover:bg-card/80 border border-border/50 transition-colors"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
};
