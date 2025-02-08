export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  minutes: number;
  metrics: any;
}

interface ElectronAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  saveFile: (options: {
    content: string;
    filename: string;
    mimeType?: string;
  }) => Promise<{ success: boolean; path: string }>;
  enterCornerMode: (timerState: TimerState) => Promise<void>;
  exitCornerMode: () => Promise<void>;
  syncTimerState: (state: TimerState) => Promise<void>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
