import { TimerMetrics } from "./metrics";
import { Quote } from "./timer";
import { Note } from "@/components/notes/Notes";

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
