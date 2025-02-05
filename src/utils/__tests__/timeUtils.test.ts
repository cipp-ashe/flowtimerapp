import { describe, test, expect } from '@jest/globals';
import { formatTime, calculateEfficiencyRatio, determineCompletionStatus } from '../timeUtils';

describe('timeUtils', () => {
  describe('formatTime', () => {
    test('formats time correctly', () => {
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(3600)).toBe('60:00');
      expect(formatTime(45)).toBe('0:45');
    });
  });

  describe('calculateEfficiencyRatio', () => {
    test('calculates ratio correctly', () => {
      // If task took half the expected time (very efficient)
      expect(calculateEfficiencyRatio(300, 150)).toBe(50);
      
      // If task took exactly the expected time
      expect(calculateEfficiencyRatio(300, 300)).toBe(100);
      
      // If task took longer than expected (cap at 100%)
      expect(calculateEfficiencyRatio(300, 450)).toBe(100);
    });

    test('handles edge cases', () => {
      // Zero values should return 0
      expect(calculateEfficiencyRatio(0, 100)).toBe(0);
      expect(calculateEfficiencyRatio(100, 0)).toBe(0);
      expect(calculateEfficiencyRatio(0, 0)).toBe(0);
    });
  });

  describe('determineCompletionStatus', () => {
    test('determines status correctly', () => {
      // Early completion
      expect(determineCompletionStatus(300, 250)).toBe('Completed Early');
      
      // On time completion
      expect(determineCompletionStatus(300, 300)).toBe('Completed On Time');
      
      // Late completion
      expect(determineCompletionStatus(300, 350)).toBe('Completed Late');
    });
  });
});
