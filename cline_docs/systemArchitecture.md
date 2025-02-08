# System Architecture

## Core State Management

### 1. Timer System
- **useTimer Hook** (src/hooks/timer/useTimer.ts)
  - State: current time, duration, status
  - Lifecycle: start, pause, resume, complete
  - Metrics tracking
  - Dependencies: none

### 2. Notes System
- **useNotes Hook** (src/hooks/useNotes.ts)
  - State Management:
    - Notes array with tags
    - Selected note for editing
    - Immediate localStorage sync
  - Operations:
    - Add note with error handling
    - Edit with tag preservation
    - Delete with state cleanup
    - Tag management (add/remove)
  - Components:
    - NotesEditor: Creation/editing
    - SavedNotes: Display/management
    - TimerExpandedView: Context integration

### 3. Quotes System
- **useQuoteManager Hook** (src/hooks/useQuoteManager.ts)
  - State: current quote, favorites
  - Context: task-based categorization
  - Display: FloatingQuotes, QuoteDisplay
  - Lifecycle: auto-cycling, user interaction

## Component Hierarchy

### 1. Timer Flow
```
Timer
├── TimerExpandedView
│   ├── QuoteDisplay
│   ├── FloatingQuotes
│   └── Notes
│       ├── NotesEditor
│       └── SavedNotes
└── TimerCompactView
```

### 2. Notes Flow
```
Notes (Container)
├── NotesEditor (Input/Edit)
│   └── NotesTabsView (Content UI)
└── SavedNotes (Display)
    ├── Note Items
    │   ├── Content Display
    │   ├── Tag Management
    │   └── Action Buttons
    └── Pagination
```

State Flow:
1. Create Note:
   - Editor input → addNote → state update → localStorage → UI refresh
2. Edit Note:
   - Select note → load in editor → update → state sync → UI update
3. Tag Management:
   - Add/remove tag → state update → localStorage → UI refresh

### 3. Quotes Flow
```
QuoteManager (Hook)
├── QuoteDisplay
├── FloatingQuotes
└── FavoriteQuotes
```

## State Flow & Event Handling

### 1. Timer Events
1. Start Timer
   - Update timer state
   - Show expanded view
   - Initialize contextual quotes

2. Complete Timer
   - Save metrics
   - Trigger celebration
   - Save associated notes

### 2. Notes Events
1. Create Note
   - Add to state
   - Update localStorage
   - Show in SavedNotes

2. Edit Note
   - Update content
   - Preserve tags
   - Maintain timestamps

3. Tag Management
   - Add/remove tags
   - Filter capabilities
   - Visual feedback

### 3. Quotes Events
1. Quote Display
   - Task context matching
   - Auto-cycling timer
   - Like/unlike handling

2. Quote Animation
   - Position calculation
   - Collision detection
   - Smooth transitions

## Shared Resources

### 1. UI Components
- Card
- Button
- Badge
- Dialog
- Toast notifications

### 2. Utilities
- Date formatting
- LocalStorage management
- State persistence
- Animation controls

### 3. Constants
- Timer durations
- Animation settings
- Layout measurements
- Quote categories

## Data Flow Principles

1. **Single Source of Truth**
   - Centralized hooks for state
   - No duplicate localStorage access
   - Consistent data models

2. **Unidirectional Data Flow**
   - Parent → Child props
   - Hooks → Components
   - Events → State updates

3. **Component Communication**
   - Props for downward
   - Callbacks for upward
   - Context for global

4. **State Persistence**
   - localStorage for notes
   - Favorites for quotes
   - Metrics for timers
