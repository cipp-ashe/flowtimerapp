# FlowTimer App

A modern desktop and web productivity app built with Electron that combines a customizable timer with task management, notes, and motivational quotes to help you stay focused and productive.

## Core Features (No Configuration Required)

- **Advanced Timer System**
  - Flexible timer with compact and expanded views
  - Visual progress tracking with circular display
  - Customizable sound notifications (bell, chime, ding)
  - Smart pause timer with 5-minute limit
  - Add time functionality (+5 minutes)
  - Keyboard shortcuts for quick control
  - Task completion confirmation dialog

- **Task Management**
  - Create and track tasks with durations
  - Task completion history and metrics
  - Multi-task selection and bulk operations
  - Task efficiency tracking

- **Notes System**
  - Rich text editor for task notes
  - Save and organize notes locally
  - Notes history tracking

- **Motivational Features**
  - Dynamic quote display with categories
  - Favorite quotes collection
  - Floating quotes for ambient motivation
  - Task-specific quote matching
  - Completion celebrations with confetti

- **Desktop App Features**
  - Always-on-top window
  - Custom titlebar with window controls
  - Frameless window design
  - System tray integration
  - Automatic updates

- **Modern UI/UX**
  - Clean, responsive interface using shadcn/ui
  - Dark/light theme support
  - Accessible design with ARIA support
  - Smooth transitions and animations
  - Custom toast notifications

## Optional Features (Requires Configuration)

These features require Supabase and Resend setup:
- Email task summaries with metrics
- Email notes sharing
- Cloud synchronization of tasks and notes

## Tech Stack

- **Core**: Electron, React 18 with TypeScript
- **Build Tools**: Vite, Electron Builder
- **Styling**: Tailwind CSS, shadcn/ui
- **UI Components**: Radix UI primitives
- **Backend** (Optional): Supabase Edge Functions
- **Email Service** (Optional): Resend
- **State Management**: React Query, Custom Hooks
- **Form Handling**: React Hook Form with Zod
- **Rich Text**: React MD Editor
- **Testing**: Jest with React Testing Library

## Getting Started

1. **Prerequisites**
   - Node.js (LTS version recommended)
   - npm or yarn package manager
   - Git

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/cipp-ashe/flowtimerapp.git

   # Navigate to project directory
   cd flowtimerapp

   # Install dependencies
   npm install
   ```

3. **Basic Usage (No Configuration Required)**
   ```bash
   # Start web development server
   npm run dev

   # Start electron development
   npm run electron:dev
   ```
   The app will run with all core features working. You'll see a warning about missing Supabase configuration, but this only affects optional email features.

4. **Optional: Environment Setup for Email Features**
   - Create a `.env` file in the root directory
   - Copy variables from `.env.example` and fill in your values:
     ```
     # Supabase Configuration (Required for email features)
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

     # Optional: Email Service Configuration
     # RESEND_API_KEY=your_resend_api_key
     ```
   
   To set up Supabase (Optional):
   1. Create a Supabase project at https://supabase.com
   2. Get your project URL and anon key from Project Settings > API
   3. For email functionality:
      - Set up a Resend account at https://resend.com
      - Add your Resend API key to enable email summaries

5. **Development & Building**
   ```bash
   # Run tests
   npm test

   # Lint code
   npm run lint

   # Build web version
   npm run build

   # Build desktop app
   npm run electron:build
   ```

6. **Desktop App Installation**
   After building, you can find the installers in the `release` directory:
   - Windows: `release/FlowTimer Setup.exe`
   - macOS: `release/FlowTimer.dmg`
   - Linux: `release/FlowTimer.AppImage`

   The desktop app includes additional features:
   - Always-on-top window for uninterrupted focus
   - Custom window controls
   - System tray integration
   - Automatic updates

## Project Structure

```
src/
├── components/        # React components
│   ├── timer/        # Timer-related components
│   ├── tasks/        # Task management components
│   ├── quotes/       # Quote display components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── integrations/     # External service integrations
```

## Component Architecture

### Timer System
- **Core Components**
  - `Timer`: Main container component orchestrating timer functionality
  - `TimerCircle`: Visual circular progress indicator with SVG animations
  - `TimerDisplay`: Digital time display with formatting
  - `TimerCompactView`/`TimerExpandedView`: Responsive layout variants
  - `TimerControls`: Play, pause, reset, and skip controls
  - `TimerHeader`: Timer status and mode indicators
  - `TimerMetrics`: Statistics and performance tracking display

- **Custom Hooks**
  - `useTimer`: Core timer logic and state management
  - `useTimerState`: Timer state and transitions
  - `useTimerControls`: Control actions and handlers
  - `useTimerEffects`: Side effects management
  - `useTimerMetrics`: Performance tracking calculations
  - `useTimerShortcuts`: Keyboard shortcuts implementation
  - `useTimerA11y`: Accessibility features and announcements

### Task Management
- **Components**
  - `TaskManager`: Main task management container
  - `TaskList`: Sortable list of active tasks
  - `TaskTable`: Detailed task view with metrics
  - `TaskRow`: Individual task item with actions
  - `TaskInput`: New task creation interface
  - `CompletedTasks`: Historical task view
  - `EmailSummaryModal`: Task summary email configuration

- **Custom Hooks**
  - `useTaskManager`: Task state and operations management
  - `useTaskOperations`: CRUD operations for tasks
  - `useLoadingState`: Loading states handling
  - `useTransition`: Smooth state transitions

### Quote System
- **Components**
  - `QuoteDisplay`: Main quote presentation
  - `FavoriteQuotes`: Saved quotes collection
  - `FloatingQuotes`: Ambient motivational display

- **Custom Hooks**
  - `useQuoteManager`: Quote fetching and management
  - `useTransition`: Animation handling for quote changes

### Utility Components
- **Audio System**
  - `SoundSelector`: Notification sound customization
  - `useAudio`: Audio playback management

- **UI Components**
  - Comprehensive set of shadcn/ui components
  - Custom toast notifications system
  - Responsive dialog components
  - Accessible form elements

## State Management

### Core Interfaces

#### Timer State and Metrics
```typescript
interface TimerMetrics {
  startTime: Date | null;
  endTime: Date | null;
  pauseCount: number;
  expectedTime: number;
  actualDuration: number;
  favoriteQuotes: number;
  pausedTime: number;
  lastPauseTimestamp: Date | null;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
}

interface UseTimerReturn {
  timeLeft: number;
  minutes: number;
  isRunning: boolean;
  metrics: TimerMetrics;
  start: () => void;
  pause: () => void;
  reset: () => void;
  addTime: (minutes: number) => void;
  setMinutes: (minutes: number) => void;
  completeTimer: () => void;
}
```

#### Task Management
```typescript
interface Task {
  id: string;
  name: string;
  metrics?: TimerMetrics;
  completed?: boolean;
}

interface TaskSummary {
  taskName: string;
  completed: boolean;
  metrics?: TimerMetrics;
  relatedQuotes: Quote[];
}
```

#### Quote System
```typescript
interface Quote {
  text: string;
  author: string;
  categories: ('motivation' | 'focus' | 'creativity' | 'learning' | 'persistence' | 'growth')[];
  timestamp?: string;
  task?: string;
}
```

## Integration Features (Optional)

### Supabase and Resend Integration
- Task summary email delivery via Resend through Supabase Edge Function
- Daily task summaries with metrics and related quotes
- Error handling and retry mechanisms

### Application State
- Real-time timer state management
- Multi-task selection and bulk operations
- Quote categorization and task association
- Metrics calculation and performance tracking

## Key Features Deep Dive

### Timer System
- Precise time tracking with pause/resume capability
- Efficiency ratio calculation: (expectedTime / netEffectiveTime) * 100
- Extension time tracking for overtime sessions
- Motivational toast notifications during key events

### Task Management
- Multi-select tasks with Ctrl/Cmd + Click
- Task metrics tracking including pause counts and duration
- Email summary generation with formatted daily reports (optional)
- Quote association with specific tasks

### Quote System
- **Smart Quote Selection**
  - Context-aware quote selection based on task keywords
  - Automatic categorization into focus, creativity, learning, persistence, motivation, and growth
  - Quote pool management with shuffling for variety
  - 15-second auto-cycling for continuous motivation

- **Task Integration**
  - Intelligent matching of quotes to task context
  - Keyword analysis for category determination
  - Fallback to motivation/focus categories when no specific match
  - Task association tracking with timestamps

- **User Interaction**
  - Like/favorite quote functionality with task context
  - Smooth transition animations between quotes
  - Toast notifications for favorite additions
  - Quote history tracking with task correlation

- **Performance Features**
  - Quote pool pre-shuffling for performance
  - Transition state management
  - Debounced quote cycling
  - Optimized re-rendering with state management

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Keep PR scope focused and manageable

### Security

For security issues, please review our [Security Policy](SECURITY.md) and follow the reporting guidelines there.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
