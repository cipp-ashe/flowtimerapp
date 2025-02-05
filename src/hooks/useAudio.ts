import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseAudioOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseAudioConfig {
  audioUrl: string;
  options?: UseAudioOptions;
}

export function useAudio({ audioUrl, options }: UseAudioConfig) {
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);

  const safeSetLoading = useCallback((loading: boolean) => {
    if (isMountedRef.current) {
      setIsLoadingAudio(loading);
    }
  }, []);

  const play = useCallback(async () => {
    if (!audioUrl) return;

    try {
      safeSetLoading(true);
      console.log('Attempting to play sound:', audioUrl);
      
      // Create new audio instance
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      // Wait for audio to load
      await new Promise<void>((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          resolve();
        };

        const handleError = (e: Event) => {
          audio.removeEventListener('canplaythrough', handleCanPlay);
          audio.removeEventListener('error', handleError);
          reject(new Error('Failed to load audio'));
        };

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.load();
      });

      // Play audio
      await audioRef.current?.play();
      console.log('Sound played successfully');
      options?.onSuccess?.();
    } catch (error) {
      console.error('Error playing sound:', error);
      const err = error instanceof Error ? error : new Error('Failed to play sound');
      options?.onError?.(err);
      if (toast?.error) {
        toast.error('Could not play sound. Please check your browser settings. 🔇');
      }
    } finally {
      safeSetLoading(false);
      audioRef.current = null;
    }
  }, [audioUrl, options, safeSetLoading]);

  const testSound = useCallback(() => {
    if (!audioUrl) {
      if (toast) {
        toast('No sound selected 🔈');
      }
      return;
    }
    play();
  }, [audioUrl, play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  return {
    play,
    testSound,
    isLoadingAudio,
  };
}
