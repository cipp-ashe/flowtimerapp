# State Management Analysis

## Core State Hooks

### 1. useNotes
Location: src/hooks/useNotes.ts
State:
- notes[]
- selectedNote
Potential Issues:
- NotesEditor has its own content state when it should use selectedNote
- SavedNotes manages tag input state locally
- Multiple localStorage access points

### 2. useQuoteManager
Location: src/hooks/useQuoteManager.ts
State:
- currentQuote
- favorites
- isLiked
- isFlipped
Potential Issues:
- Timer component duplicates favorites state
- Multiple components manage quote transitions

### 3. useTimer
Location: src/hooks/timer/useTimer.ts
State:
- timeLeft
- isRunning
- metrics
Potential Issues:
- TimerDisplay has local animation state
- Multiple components track running state

### 4. useTaskManager
Location: src/hooks/useTaskManager.ts
State:
- tasks[]
- currentTask
Potential Issues:
- TaskList manages selection state locally
- Multiple components track task completion

## Component State Analysis

### Timer Components

1. Timer.tsx
Local State:
- isExpanded
- selectedSound
- showCompletion
- showConfirmation
- completionMetrics
- internalMinutes
- pauseTimeLeft
Should Use:
- Timer state from useTimer
- Sound settings from central audio manager

2. TimerExpandedView.tsx
Local State:
- None, but receives many props
Should Use:
- Timer context instead of prop drilling

3. TimerDisplay.tsx
Local State:
- Animation states
Should Use:
- Timer context for all states

### Notes Components

1. NotesEditor.tsx
Local State:
- currentContent
Should Use:
- selectedNote from useNotes directly

2. SavedNotes.tsx
Local State:
- currentPage
- tagInput
Should Use:
- Tag management from useNotes

3. Notes.tsx
Local State:
- None, but duplicates state management
Should Use:
- Direct useNotes operations

### Quote Components

1. QuoteDisplay.tsx
Local State:
- None, but manages transitions
Should Use:
- Transition state from useQuoteManager

2. FloatingQuotes.tsx
Local State:
- positions
- animation frames
Should Use:
- Central animation manager

3. FavoriteQuotes.tsx
Local State:
- currentPage
Should Use:
- Pagination from shared utility

## Identified Patterns

1. State Duplication:
- Note content management
- Timer state tracking
- Quote favorites handling

2. Local State that Should be Centralized:
- Pagination states
- Animation states
- Form input states

3. Prop Drilling:
- Timer state through multiple levels
- Note operations passed down chain
- Quote management across views

## Recommended Changes

1. Create Contexts:
- TimerContext
- NotesContext
- QuotesContext

2. Centralize State:
- Move all pagination to shared hook
- Create animation state manager
- Unified form state management

3. Remove Duplications:
- Consolidate localStorage access
- Single source for each state type
- Unified state updates

4. Component Refactoring:
- Remove local state management
- Use context consumers
- Implement proper state delegation

## Implementation Priority

1. High Priority:
- Fix notes state management
- Consolidate timer state
- Unify quote management

2. Medium Priority:
- Create shared contexts
- Implement animation manager
- Standardize pagination

3. Low Priority:
- Optimize state updates
- Add state persistence layer
- Implement error boundaries
