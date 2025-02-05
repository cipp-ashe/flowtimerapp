import { memo } from "react";
import ReactConfetti from "react-confetti";

interface TimerConfettiProps {
  show: boolean;
  width: number;
  height: number;
}

export const TimerConfetti = memo(({ show, width, height }: TimerConfettiProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <ReactConfetti
        width={width}
        height={height}
        gravity={0.12}
        numberOfPieces={400}
        recycle={true}
        colors={["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#EDE9FE"]}
        tweenDuration={5000}
        wind={0.01}
        initialVelocityY={-2}
      />
    </div>
  );
});

TimerConfetti.displayName = 'TimerConfetti';