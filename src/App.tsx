import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ComponentExamples from "./pages/ComponentExamples";
import { AppLayout } from "./components/AppLayout";
import { NotesPanelProvider } from "./hooks/useNotesPanel";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import "@/styles/electron.css";

// Suppress specific React Router v7 warnings
window.__reactRouterFutureWarnings = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const queryClient = new QueryClient();

// Use HashRouter for electron, BrowserRouter for web
const Router = window.electron ? HashRouter : BrowserRouter;

const App = () => {
  const [isCornerMode, setIsCornerMode] = useState(false);
  useTheme(true); // Initialize dark theme

  useEffect(() => {
    // Check if we're in corner mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    setIsCornerMode(mode === 'corner');
  }, []);

  // In corner mode, only render the Index component with minimal providers
  if (isCornerMode) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="h-screen bg-background">
            <Index cornerMode={true} />
          </div>
          <Toaster position="bottom-right" closeButton />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Normal mode with full app layout
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <NotesPanelProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index cornerMode={false} />} />
                <Route path="/components" element={<ComponentExamples />} />
              </Routes>
            </AppLayout>
            <Toaster position="bottom-right" closeButton />
          </NotesPanelProvider>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
