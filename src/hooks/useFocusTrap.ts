import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  enabled: boolean;
  onEscape?: () => void;
}

export const useFocusTrap = ({ enabled, onEscape }: UseFocusTrapOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => {
      return (
        !element.hasAttribute('disabled') &&
        !element.hasAttribute('aria-hidden') &&
        element.getAttribute('tabindex') !== '-1'
      );
    });
  }, []);

  // Handle focus trap
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    // Store current active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Set initial focus to the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, onEscape, getFocusableElements]);

  // Handle initial focus when the trap becomes enabled
  useEffect(() => {
    if (!enabled) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [enabled, getFocusableElements]);

  return {
    containerRef,
    getFocusableElements,
  };
};

// Helper functions for managing focus order
export const focusOrder = (order: number) => ({
  tabIndex: order,
  style: { outline: 'none' } as const,
});

export const focusClass = "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none";