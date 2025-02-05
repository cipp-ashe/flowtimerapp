import React from 'react';
import { TimerCircle } from '../timer/TimerCircle';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

describe('TimerCircle', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  const defaultProps = {
    size: 'normal' as const,
    isRunning: false,
    timeLeft: 300,
    minutes: 5,
    circumference: 282.74,
    a11yProps: {
      'aria-label': 'Timer showing 5 minutes remaining',
      'aria-valuemax': 300,
      'aria-valuenow': 300,
      role: 'timer'
    }
  };

  test('renders with correct size', () => {
    const { container } = render(<TimerCircle {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('timer-circle');
  });

  test('shows active state when running', () => {
    const { container } = render(
      <TimerCircle {...defaultProps} isRunning={true} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('timer-circle', 'active');
  });

  test('displays correct time', () => {
    render(<TimerCircle {...defaultProps} />);
    const timeDisplay = screen.getByText('05:00');
    expect(timeDisplay).toBeInTheDocument();
  });

  test('applies correct ARIA attributes', () => {
    render(<TimerCircle {...defaultProps} />);
    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('aria-label', 'Timer showing 5 minutes remaining');
    expect(timer).toHaveAttribute('aria-valuemax', '300');
    expect(timer).toHaveAttribute('aria-valuenow', '300');
  });

  test('renders large size correctly', () => {
    const { container } = render(
      <TimerCircle {...defaultProps} size="large" />
    );
    const timerContainer = container.firstChild;
    expect(timerContainer).toHaveClass('w-48', 'h-48', 'sm:w-56', 'sm:h-56');
  });

  test('calculates progress circle offset', () => {
    const { container } = render(
      <TimerCircle {...defaultProps} timeLeft={150} minutes={5} />
    );
    const progressCircle = container.querySelector('circle:last-child');
    const offset = progressCircle?.getAttribute('stroke-dashoffset');
    expect(parseFloat(offset || '0')).toBeGreaterThan(0);
  });

  test('handles zero time remaining', () => {
    render(
      <TimerCircle
        {...defaultProps}
        timeLeft={0}
        minutes={5}
        a11yProps={{
          ...defaultProps.a11yProps,
          'aria-valuenow': 0
        }}
      />
    );
    const timeDisplay = screen.getByText('00:00');
    expect(timeDisplay).toBeInTheDocument();
  });

  test('formats single-digit minutes correctly', () => {
    render(
      <TimerCircle
        {...defaultProps}
        timeLeft={540}
        minutes={9}
        a11yProps={{
          ...defaultProps.a11yProps,
          'aria-label': 'Timer showing 9 minutes remaining',
          'aria-valuemax': 540,
          'aria-valuenow': 540
        }}
      />
    );
    const timeDisplay = screen.getByText('09:00');
    expect(timeDisplay).toBeInTheDocument();
  });

  test('handles reduced motion preference', () => {
    mockMatchMedia.mockImplementation(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    const { container } = render(<TimerCircle {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('timer-circle');
    expect(svg).not.toHaveClass('active');
  });
});
