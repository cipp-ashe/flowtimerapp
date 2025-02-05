import { memo, useEffect, useRef } from "react";
import { TimerCircleProps } from "../../types/timer";

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const TimerCircle = memo(({
  size,
  isRunning,
  timeLeft,
  minutes,
  circumference,
  a11yProps,
  onClick
}: TimerCircleProps) => {
  const progressRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const prevTimeLeftRef = useRef(timeLeft);
  const isMountedRef = useRef(true);

  // Smoothly animate the progress circle and time text
  useEffect(() => {
    if (!progressRef.current || !textRef.current || !isMountedRef.current) return;

    if (prefersReducedMotion) {
      progressRef.current.style.transition = 'none';
      progressRef.current.style.strokeDashoffset = `${
        circumference * ((minutes * 60 - timeLeft) / (minutes * 60))
      }`;
      textRef.current.textContent = formatTime(timeLeft);
      return;
    }

    const startValue = prevTimeLeftRef.current;
    const endValue = timeLeft;
    const duration = 1000; // 1 second transition
    const startTime = performance.now();

    let animationFrameId: number;
    
    const animate = (currentTime: number) => {
      if (!isMountedRef.current) return;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentTime1 = startValue - (startValue - endValue) * eased;
      
      if (progressRef.current) {
        progressRef.current.style.strokeDashoffset = `${
          circumference * ((minutes * 60 - currentTime1) / (minutes * 60))
        }`;
      }

      if (textRef.current) {
        textRef.current.textContent = formatTime(Math.round(currentTime1));
      }

      if (progress < 1 && isMountedRef.current) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    prevTimeLeftRef.current = timeLeft;

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [timeLeft, minutes, circumference]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const sizeClasses = size === 'large' 
    ? 'w-48 h-48 sm:w-56 sm:h-56' 
    : 'w-48 h-48';

  return (
    <div 
      className={`relative mx-auto ${sizeClasses} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...a11yProps}
    >
      <svg 
        className={`timer-circle ${isRunning ? 'active' : ''}`} 
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          className="text-muted/10 stroke-current"
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          ref={progressRef}
          className={`stroke-current ${
            isRunning
              ? 'text-primary filter drop-shadow-lg'
              : 'text-primary/50'
          }`}
          strokeWidth="4"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * ((minutes * 60 - timeLeft) / (minutes * 60))}
          transform="rotate(-90 50 50)"
          style={prefersReducedMotion ? { transition: 'none' } : undefined}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          ref={textRef}
          className={`font-mono font-bold ${size === 'large' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}`}
          style={prefersReducedMotion ? { transition: 'none' } : undefined}
        >
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
});

TimerCircle.displayName = 'TimerCircle';
