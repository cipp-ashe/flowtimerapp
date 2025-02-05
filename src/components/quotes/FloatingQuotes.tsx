import { memo, useEffect, useRef, useState } from "react";
import { Quote } from "@/types/timer/models";

interface FloatingQuotesProps {
  favorites: Quote[];
}

interface QuotePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Animation constants
const BASE_SPEED = 0.2;      // Increased from 0.15
const SPEED_VARIANCE = 0.15;  // Increased from 0.1
const MAX_WIDTH = 300;
const SAFE_MARGIN = (MAX_WIDTH / window.innerWidth) * 100;

export const FloatingQuotes = memo(({ favorites }: FloatingQuotesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<QuotePosition[]>([]);
  const positionsRef = useRef<QuotePosition[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize random positions and directions
  useEffect(() => {
    if (!favorites.length) return;

    const newPositions = favorites.map(() => {
      const x = Math.random() * (90 - SAFE_MARGIN) + SAFE_MARGIN / 2;
      const y = Math.random() * 80 + 10;
      const angle = Math.random() * Math.PI * 2;
      const speed = BASE_SPEED + (Math.random() - 0.5) * SPEED_VARIANCE;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      return { x, y, vx, vy };
    });

    setPositions(newPositions);
    positionsRef.current = newPositions;
  }, [favorites.length]);

  // Animation loop with smooth movement
  useEffect(() => {
    if (!positions.length || !containerRef.current) return;

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16; // Normalize to ~60fps
      lastTime = currentTime;

      const newPositions = positionsRef.current.map(pos => {
        let { x, y, vx, vy } = pos;

        // Update position with delta time
        x += vx * deltaTime;
        y += vy * deltaTime;

        // Gentle bounce logic
        if (x < SAFE_MARGIN || x > 100 - SAFE_MARGIN) {
          vx = -vx;
          x = x < SAFE_MARGIN ? SAFE_MARGIN : 100 - SAFE_MARGIN;
        }
        if (y < 10 || y > 90) {
          vy = -vy;
          y = y < 10 ? 10 : 90;
        }

        return { x, y, vx, vy };
      });

      positionsRef.current = newPositions;
      setPositions(newPositions);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [positions.length]);

  if (!favorites.length) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {favorites.map((quote, index) => {
        const position = positions[index];
        if (!position) return null;

        return (
          <div
            key={quote.text}
            className="absolute transition-[transform] duration-100 ease-linear"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `translate(-50%, -50%)`,
              maxWidth: `${MAX_WIDTH}px`,
              textAlign: "center",
              whiteSpace: "normal",
              willChange: "transform",
            }}
          >
            <div 
              className="text-lg font-light italic text-primary/80 leading-relaxed backdrop-blur-sm"
              style={{
                textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              "{quote.text}"
            </div>
            <div className="text-sm text-primary/60 mt-1">
              — {quote.author}
            </div>
          </div>
        );
      })}
    </div>
  );
});

FloatingQuotes.displayName = "FloatingQuotes";
