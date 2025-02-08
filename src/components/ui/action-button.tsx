import React from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const ActionButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'sm',
  className,
  children,
  ...props
}: ActionButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        // Base styles
        'relative transition-colors',
        // Ghost variant specific styles
        variant === 'ghost' && [
          'text-muted-foreground hover:text-primary',
          'hover:bg-primary/10',
          'active:bg-primary/20',
        ],
        className
      )}
      {...props}
    >
      {Icon && <Icon className={cn('h-4 w-4', children && 'mr-2')} />}
      {children}
    </Button>
  );
};