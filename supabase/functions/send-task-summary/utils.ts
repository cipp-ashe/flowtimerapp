// CORS headers for edge function responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export interface Note {
  id: string;
  content: string;
  title: string;
  tags: string[];
  createdAt: string;
}

export interface FormattedMetrics {
  plannedDuration: string;
  actualDuration: string;
  netEffectiveTime: string;
  efficiency: number;
  pauseCount: number;
  favoriteQuotes: Quote[];
}

export interface TaskSummary {
  taskName: string;
  metrics?: TimerMetrics;
  formattedMetrics?: FormattedMetrics | null;
}

export interface NotesSummary {
  notes: Note[];
  tags: string[];
  totalNotes: number;
}

export interface DailySummary {
  date: string;
  completedTasks: TaskSummary[];
  unfinishedTasks: TaskSummary[];
  totalTimeSpent: number;
  totalPlannedTime: number;
  totalPauses: number;
  averageEfficiency: number;
  favoriteQuotes: Quote[];
  notes?: NotesSummary;
}

export interface Quote {
  text: string;
  author: string;
  task?: string;
}

export interface TimerMetrics {
  expectedTime: number;
  actualDuration: number;
  pauseCount: number;
  favoriteQuotes: number;
  pausedTime: number;
  extensionTime: number;
  netEffectiveTime: number;
  efficiencyRatio: number;
  completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
}

// Helper function to format minutes into hours and minutes
const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  if (hours === 0) {
    return `${minutes} minutes`;
  }
  if (minutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes > 1 ? 's' : ''}`;
};

// Helper function to format task summary email
export const formatTaskSummaryEmail = (data: DailySummary): string => {
  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #2563eb; }
          ul { list-style-type: none; padding-left: 0; }
          li { margin: 10px 0; padding: 10px; background: #f3f4f6; border-radius: 4px; }
          .highlight { color: #2563eb; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Your Daily Task Summary</h1>
        <p>Here's a summary of your tasks and productivity today:</p>
        <ul>
          <li>Completed Tasks: <span class="highlight">${data.completedTasks.length}</span></li>
          <li>Average Efficiency: <span class="highlight">${data.averageEfficiency.toFixed(1)}%</span></li>
          <li>Total Time Spent: <span class="highlight">${formatMinutes(data.totalTimeSpent / 60)}</span></li>
          <li>Unfinished Tasks: <span class="highlight">${data.unfinishedTasks.length}</span></li>
          <li>Total Pauses: <span class="highlight">${data.totalPauses}</span></li>
        </ul>
        <p>Keep up the great work! 💪</p>
      </body>
    </html>
  `;
};

// Helper function to format notes summary email
export const formatNotesSummaryEmail = (data: any): string => {
  // Handle both array and object formats
  const notes = Array.isArray(data) ? data : data.notes ?? [];
  const tags = Array.isArray(data) ? [] : data.tags ?? [];
  const totalNotes = Array.isArray(data) ? data.length : data.totalNotes ?? notes.length;

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #2563eb; }
          .highlight { color: #2563eb; font-weight: bold; }
          .notes-container { margin-top: 20px; }
          .note { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
          .note-title { margin: 0 0 10px 0; color: #2563eb; }
          .tag { display: inline-block; padding: 4px 8px; margin: 0 4px 4px 0; background: #e2e8f0; border-radius: 4px; font-size: 12px; }
          .note-content { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>Your Notes Summary</h1>
        <p>Here's a collection of your notes:</p>
        <p>Total Notes: <span class="highlight">${totalNotes}</span></p>
        ${tags.length > 0 ? `
          <p>Tags Used: <span class="highlight">${tags.join(', ')}</span></p>
        ` : ''}
        <div class="notes-container">
          ${notes.map(note => `
            <div class="note">
              <h3 class="note-title">${note.title ?? 'Untitled Note'}</h3>
              ${(note.tags ?? []).length > 0 ? `
                <div style="margin-bottom: 10px;">
                  ${note.tags.map(tag => `
                    <span class="tag">${tag}</span>
                  `).join('')}
                </div>
              ` : ''}
              <div class="note-content">${note.content ?? ''}</div>
            </div>
          `).join('')}
        </div>
        <p>Happy note-taking! 📝</p>
      </body>
    </html>
  `;
};
