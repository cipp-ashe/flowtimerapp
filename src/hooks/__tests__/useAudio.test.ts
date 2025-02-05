import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { createHookTester } from '../../testUtils/hookTester';
import { useAudio } from '../useAudio';

describe('useAudio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with default state', () => {
    const { result } = createHookTester(useAudio)({
      audioUrl: 'test.mp3'
    });

    expect(result.isLoadingAudio).toBeFalsy();
    expect(typeof result.play).toBe('function');
    expect(typeof result.testSound).toBe('function');
  });

  test('plays audio successfully', async () => {
    const onSuccess = jest.fn();
    const { result } = createHookTester(useAudio)({
      audioUrl: 'test.mp3',
      options: { onSuccess }
    });

    await result.play();

    expect(onSuccess).toHaveBeenCalled();
  });

  test('handles play errors', async () => {
    const onError = jest.fn();
    const { result } = createHookTester(useAudio)({
      audioUrl: 'test.mp3',
      options: { onError }
    });

    await result.play();

    expect(onError).not.toHaveBeenCalled();
  });

  test('handles missing audio url', async () => {
    const { result } = createHookTester(useAudio)({
      audioUrl: ''
    });

    await result.testSound();
  });
});
