# Project Structure Map

## Core Application Structure

```
src/
├── components/     # UI Components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── pages/         # Page components
├── data/          # Static data
├── lib/           # Core libraries
├── integrations/  # External integrations
└── testUtils/     # Testing utilities
```

## Key Components

### Timer Related
- `src/components/timer/Timer.tsx` - Main timer component
- `src/components/timer/TimerMetrics.tsx` - Timer statistics display
- `src/hooks/timer/useTimer.ts` - Timer logic hook
- `src/hooks/timer/useTimerMetrics.ts` - Timer metrics management

### Task Management
- `src/components/tasks/TaskTable.tsx` - Task list container
- `src/components/tasks/TaskList.tsx` - Task list view
- `src/components/tasks/TaskRow.tsx` - Individual task item
- `src/hooks/useTaskManager.ts` - Task management logic
- `src/hooks/useTaskOperations.ts` - Task CRUD operations

### UI Components
- `src/components/ui/` - Reusable UI components
- `src/components/CompletedTasks.tsx` - Completed tasks display
- `src/components/EmailSummaryModal.tsx` - Email summary dialog
- `src/components/SoundSelector.tsx` - Sound selection interface

## Custom Hooks

### Timer Hooks
- `useTimer` - Core timer functionality
- `useTimerMetrics` - Timer statistics tracking
- `useTimerControls` - Timer control operations

### UI Hooks
- `useAudio` - Audio playback management
- `useFocusTrap` - Accessibility focus management
- `useTheme` - Theme management
- `useTransition` - Animation transitions
- `useWindowSize` - Responsive design helper
- `useMobile` - Mobile detection
- `useLoadingState` - Loading state management

### Task Hooks
- `useTaskManager` - Task state management
- `useTaskOperations` - Task operations
- `useMinutesHandlers` - Time input handling

## Type Definitions

### Timer Types
Location: `src/types/timer/`
- Timer state types
- Timer configuration
- Timer metrics

### Global Types
Location: `src/types/`
- `global.d.ts` - Global type declarations
- `metrics.ts` - Metrics related types
- `summary.ts` - Summary related types

## Testing Structure

### Test Utils
Location: `src/testUtils/`
- `hookTester.ts` - Custom hook testing utilities
- `testRunner.ts` - Test execution utilities
- `mockSetup.ts` - Mock data and setup
- `timerTestSetup.ts` - Timer specific test setup

### Test Files
- Components: `src/components/__tests__/`
- Hooks: `src/hooks/__tests__/`
- Utils: `src/utils/__tests__/`

## External Integrations

### Supabase
- `src/lib/supabase.ts` - Supabase client setup
- `src/integrations/supabase/` - Supabase specific integrations

## Utility Functions

### Time Utilities
Location: `src/utils/`
- `timeUtils.ts` - Time manipulation functions
- `summaryFormatter.ts` - Summary formatting utilities

## Build Configuration

Key configuration files:
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `jest.config.ts` - Jest test configuration

## Component Examples
Location: `component-examples/`
- Standalone component examples
- Component documentation
- Usage patterns

## Public Assets
Location: `public/`
- Sound files: `sounds/`
- Images and icons
- Static assets

## Component Dependencies & Relationships

### Core Application Flow
- `App.tsx` integrates:
  - React Router for navigation
  - React Query for data fetching
  - Global providers (Tooltip, Toast)
  - Main routes (Index, ComponentExamples)

### Timer Feature Architecture
- `Timer.tsx` (Main Timer Component)
  - Uses: useAudio, useTimerState hooks
  - Components: TimerCircle, TimerControls, TimerMetrics
  - Views: TimerExpandedView, TimerCompactView
  - Integrates with: CompletionCelebration, FloatingQuotes

### Task Management Architecture
- `TaskManager.tsx` (Task Management Container)
  - Uses: useTaskOperations hook
  - Components: TaskList, TimerSection
  - State: Task[] (shared across components)

- `TaskList.tsx` (Task List Container)
  - Uses: useTaskManager hook
  - Components: TaskInput, TaskTable, CompletedTasks
  - Integrates with: EmailSummaryModal

### UI Component Dependencies
- Most UI components use:
  - @radix-ui primitives
  - class-variance-authority for variants
  - lucide-react for icons
  - tailwind utilities (cn)

### Hook Dependencies
- Timer Hooks:
  - useTimer → useTimerState, useAudio
  - useTimerMetrics → useTimer
  - useTimerControls → useTimer

- Task Hooks:
  - useTaskManager → useTaskOperations
  - useTaskOperations → useLoadingState
  - useMinutesHandlers → useState

### Type Dependencies
- Timer types used across:
  - Timer components
  - Task components
  - Quote components
  - Metrics display

## Key External Dependencies

### Core Dependencies
- React + React DOM
- TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Jest (Testing)
- Supabase (Backend)

### UI Dependencies
- Radix UI (Accessible primitives)
- Lucide React (Icons)
- React Query (Data fetching)
- React Router (Navigation)
- Sonner (Toast notifications)

### Testing Dependencies
- Jest
- React Testing Library
- MSW (API mocking)

## State Management & Data Flow

### Timer State Management
- Timer state managed through custom hooks:
  - useTimer: Core timer logic and state
  - useTimerState: Timer phase management
  - useTimerMetrics: Statistics tracking
  - useAudio: Sound effect management

### Task State Management
- Task state flows through:
  1. TaskManager (top-level container)
  2. useTaskManager (central state hook)
  3. Individual components (TaskList, TaskTable, TaskRow)
- Operations handled by useTaskOperations hook

### Data Persistence
- Supabase integration for:
  - Task storage
  - User preferences
  - Session management

### Event Flow
1. User interactions trigger component handlers
2. Handlers call appropriate hook methods
3. State updates flow down through component tree
4. Side effects (e.g., sound, persistence) handled by specialized hooks

### Global State
- Theme management through useTheme hook
- Toast notifications via Sonner
- Loading states via useLoadingState
- Mobile detection via useMobile

### Data Loading Patterns
- React Query for API data fetching
- Custom hooks for local state management
- Loading states handled uniformly through useLoadingState
- Error boundaries for component-level error handling
