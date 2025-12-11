import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOrderbookHistory } from './useOrderbookHistory';

const LIVE_SNAP_THRESHOLD = 5;

export function useOrderbookPlayback() {
  const { getAll, size } = useOrderbookHistory();

  const frames = getAll();
  const historyLength = size;

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [virtualTime, setVirtualTime] = useState<number>(0);

  const rafRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  const effectiveIndex = useMemo(() => {
    if (
      currentIndex === -1 ||
      (!isPaused && currentIndex >= historyLength - 1)
    ) {
      return historyLength - 1;
    }
    return currentIndex;
  }, [currentIndex, historyLength, isPaused]);

  const currentData = useMemo(() => {
    if (effectiveIndex < 0 || effectiveIndex >= frames.length) return null;
    return frames[effectiveIndex];
  }, [frames, effectiveIndex]);

  const nextFrameInfo = useMemo(() => {
    if (effectiveIndex >= historyLength - 1) return null;

    const currentFrame = frames[effectiveIndex];
    const nextFrame = frames[effectiveIndex + 1];

    if (!currentFrame || !nextFrame) return null;

    const frameDuration = nextFrame.timestamp - currentFrame.timestamp;
    const remaining = Math.max(0, frameDuration - virtualTime);

    return {
      duration: frameDuration,
      elapsed: virtualTime,
      remaining,
      remainingSeconds: Math.ceil(remaining / 1000),
      progress:
        frameDuration > 0 ? Math.min(1, virtualTime / frameDuration) : 1,
    };
  }, [frames, effectiveIndex, virtualTime, historyLength]);

  const isLive = effectiveIndex === historyLength - 1;
  const isPlaying = !isPaused;
  const canGoBack = effectiveIndex > 0;
  const canGoForward = effectiveIndex < historyLength - 1;

  const timeBehindLive = useMemo(() => {
    if (historyLength === 0 || !currentData) return 0;
    return Date.now() - currentData.timestamp;
  }, [currentData, historyLength]);

  // Playback loop
  useEffect(() => {
    if (isPaused || historyLength === 0) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
      return;
    }

    let isActive = true;

    const animate = (timestamp: number) => {
      if (!isActive) return;

      if (timestamp - lastUpdateRef.current >= 1000) {
        lastUpdateRef.current = timestamp;

        setVirtualTime((prev) => {
          const currentFrame = frames[effectiveIndex];
          const nextFrame = frames[effectiveIndex + 1];

          if (!currentFrame || !nextFrame) {
            setCurrentIndex(historyLength - 1);
            return 0;
          }

          const frameDuration = nextFrame.timestamp - currentFrame.timestamp;
          const newTime = prev + 1000;

          if (newTime >= frameDuration) {
            setCurrentIndex((idx) => Math.min(idx + 1, historyLength - 1));
            return 0;
          }

          return newTime;
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    lastUpdateRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPaused, historyLength, frames, effectiveIndex]);

  // Initialize to latest when history first loads
  useEffect(() => {
    if (historyLength > 0 && currentIndex === -1) {
      setCurrentIndex(historyLength - 1);
    }
  }, [historyLength, currentIndex]);

  // Auto-follow latest frame when already at the end
  useEffect(() => {
    if (!isPaused && currentIndex === historyLength - 2) {
      setCurrentIndex(historyLength - 1);
      setVirtualTime(0);
    }
  }, [isPaused, currentIndex, historyLength]);

  const goToLive = useCallback(() => {
    setCurrentIndex(historyLength - 1);
    setVirtualTime(0);
    setIsPaused(false);
  }, [historyLength]);

  const goToStart = useCallback(() => {
    setCurrentIndex(0);
    setVirtualTime(0);
    // Keep current play/pause state
  }, []);

  const togglePaused = useCallback(() => {
    setIsPaused((prev) => {
      if (prev) {
        lastUpdateRef.current = performance.now();
      } else {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = undefined;
        }
      }
      return !prev;
    });
  }, []);

  const goToIndex = useCallback(
    (i: number) => {
      const clampedIndex = Math.max(0, Math.min(i, historyLength - 1));
      setCurrentIndex(clampedIndex);
      setVirtualTime(0);
    },
    [historyLength],
  );

  const goBack = useCallback(() => {
    if (!canGoBack) return;
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setVirtualTime(0);
  }, [canGoBack]);

  const goForward = useCallback(() => {
    if (!canGoForward) return;
    setCurrentIndex((prev) => {
      const nextIdx = Math.min(prev + 1, historyLength - 1);

      if (!isPaused && historyLength - nextIdx <= LIVE_SNAP_THRESHOLD) {
        return historyLength - 1;
      }

      return nextIdx;
    });
    setVirtualTime(0);
  }, [canGoForward, historyLength, isPaused]);

  return {
    isLive,
    isPaused,
    isPlaying,
    togglePaused,
    goToIndex,
    goBack,
    goForward,
    goToLive,
    goToStart,
    canGoBack,
    canGoForward,
    index: effectiveIndex,
    historyLength,
    currentData,
    nextFrameInfo,
    timeBehindLive,
  };
}
