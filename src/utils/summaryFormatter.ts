import { TaskSummary, DailySummary, NotesSummary } from "../types/summary";
import { Quote } from "../types/timer";
import { TimerMetrics } from "../types/metrics";
import { Note } from "@/components/notes/Notes";

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};

const calculateEfficiency = (metrics: TimerMetrics[]): number => {
  if (metrics.length === 0) return 0;
  
  const totalEfficiency = metrics.reduce((acc, metric) => {
    if (metric.expectedTime === 0 || metric.netEffectiveTime === 0) return acc;
    // Calculate efficiency as defined in TimerMetrics type
    return acc + Math.min((metric.netEffectiveTime / metric.expectedTime) * 100, 200); // Cap at 200% efficiency
  }, 0);
  
  return Math.round(totalEfficiency / metrics.length);
};

export const formatNotesSummary = (notes: Note[]): NotesSummary => {
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));
  
  return {
    notes,
    tags: allTags,
    totalNotes: notes.length
  };
};

export const formatDailySummary = (
  completedTasks: TaskSummary[],
  unfinishedTasks: TaskSummary[],
  favoriteQuotes: Quote[],
  notes?: Note[]
): DailySummary => {
  console.log('Summary Formatter - Input tasks:', completedTasks.map(task => ({
    taskName: task.taskName,
    metrics: task.metrics ? {
      expectedTime: task.metrics.expectedTime,
      actualDuration: task.metrics.actualDuration,
      netEffectiveTime: task.metrics.netEffectiveTime,
      efficiencyRatio: task.metrics.efficiencyRatio
    } : null
  })));

  const metrics = completedTasks
    .map(task => task.metrics)
    .filter((metrics): metrics is TimerMetrics => metrics !== undefined);

  console.log('Summary Formatter - Filtered metrics:', metrics.map(m => ({
    expectedTime: m.expectedTime,
    actualDuration: m.actualDuration,
    netEffectiveTime: m.netEffectiveTime,
    efficiencyRatio: m.efficiencyRatio
  })));

  const totalTimeSpent = metrics.reduce((total, metric) => {
    return total + (metric.actualDuration || 0);
  }, 0);

  const totalPlannedTime = metrics.reduce((total, metric) => {
    return total + (metric.expectedTime || 0);
  }, 0);

  const totalPauses = metrics.reduce((total, metric) => {
    return total + (metric.pauseCount || 0);
  }, 0);

  const averageEfficiency = calculateEfficiency(metrics);

  const formattedCompletedTasks = completedTasks.map(task => ({
    ...task,
    formattedMetrics: task.metrics ? {
      plannedDuration: formatDuration(task.metrics.expectedTime),
      actualDuration: formatDuration(task.metrics.actualDuration),
      netEffectiveTime: formatDuration(task.metrics.netEffectiveTime),
      efficiency: task.metrics.efficiencyRatio,
      pauseCount: task.metrics.pauseCount,
      favoriteQuotes: task.metrics.favoriteQuotes,
    } : null
  }));

  return {
    date: new Date().toISOString(),
    completedTasks: formattedCompletedTasks,
    unfinishedTasks,
    totalTimeSpent,
    totalPlannedTime,
    totalPauses,
    averageEfficiency,
    favoriteQuotes,
    notes: notes ? formatNotesSummary(notes) : undefined,
  };
};
