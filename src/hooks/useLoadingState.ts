import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseLoadingStateOptions {
  errorMessage?: string;
  successMessage?: string;
}

interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}

export const useLoadingState = (options: UseLoadingStateOptions = {}) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });

  const startLoading = useCallback(() => {
    setState({ isLoading: true, error: null });
  }, []);

  const stopLoading = useCallback((error?: Error) => {
    setState({
      isLoading: false,
      error: error || null,
    });

    if (error) {
      toast.error(`${options.errorMessage || error.message} ⚠️`);
    } else if (options.successMessage) {
      toast.success(`${options.successMessage} ✨`);
    }
  }, [options.errorMessage, options.successMessage]);

  const wrapPromise = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    startLoading();
    try {
      const result = await promise;
      stopLoading();
      return result;
    } catch (error) {
      stopLoading(error instanceof Error ? error : new Error('An error occurred'));
      throw error;
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    startLoading,
    stopLoading,
    wrapPromise,
  };
};
