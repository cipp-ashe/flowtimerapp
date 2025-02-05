import React, { ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MinutesButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "up" | "down";
  disabled?: boolean;
  "aria-label": string;
}

export const MinutesButton = ({
  direction,
  disabled,
  onClick,
  onTouchStart,
  className,
  ...props
}: MinutesButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  const handleTouch = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTouchStart) onTouchStart(e);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      onTouchStart={handleTouch}
      className={`border-primary/20 hover:bg-primary/20 touch-manipulation ${className}`}
      disabled={disabled}
      {...props}
    >
      {direction === "up" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </Button>
  );
};
