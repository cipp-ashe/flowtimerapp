export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const calculateEfficiencyRatio = (expectedTime: number, netEffectiveTime: number): number => {
  if (netEffectiveTime === 0 || expectedTime === 0) return 0;
  // Calculate efficiency as (netEffectiveTime / expectedTime) * 100
  // Lower ratio means more efficient (completed in less time than expected)
  const ratio = (netEffectiveTime / expectedTime) * 100;
  return Math.min(ratio, 100);
};

export const determineCompletionStatus = (expectedTime: number, netEffectiveTime: number) => {
  if (netEffectiveTime < expectedTime) return 'Completed Early';
  if (netEffectiveTime === expectedTime) return 'Completed On Time';
  return 'Completed Late';
};
