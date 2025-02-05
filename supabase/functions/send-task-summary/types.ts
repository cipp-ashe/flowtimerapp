export interface Task {
  taskName: string;
  metrics?: {
    actualDuration: number;
    efficiencyRatio: number;
    expectedTime: number;
    pauseCount: number;
    pausedTime: number;
    extensionTime: number;
    netEffectiveTime: number;
    favoriteQuotes: number;
    completionStatus: 'Completed Early' | 'Completed On Time' | 'Completed Late';
  };
}

export interface Quote {
  text: string;
  author: string;
}
export interface DailySummary {
  completedTasks: Task[];
  unfinishedTasks: Task[];
  totalTimeSpent: number;
  totalPlannedTime: number;
  totalPauses: number;
  averageEfficiency: number;
  favoriteQuotes: Quote[];
}