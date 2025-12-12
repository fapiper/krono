import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useOrderbookHistory } from './useOrderbookHistory';

export function useOrderbookPlayback() {
  const { getAll, size } = useOrderbookHistory();
  const frames = getAll();

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [virtualTime, setVirtualTime] = useState<number>(0);

  const [isTrackingLive, setIsTrackingLive] = useState(true);

  const stateRef = useRef({
    frames,
    currentIndex,
    isPaused,
    size,
    isTrackingLive,
  });
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  useEffect(() => {
    stateRef.current = { frames, currentIndex, isPaused, size, isTrackingLive };
  }, [frames, currentIndex, isPaused, size, isTrackingLive]);

  const safeIndex = Math.max(0, Math.min(currentIndex, size - 1));
  const currentData = frames[safeIndex] || null;

  // UI is "Live" if we are explicitly tracking it, or accidentally hit the end
  const isLive = isTrackingLive || safeIndex === size - 1;

  const nextFrameInfo = useMemo(() => {
    if (safeIndex >= size - 1) return null;

    const currentFrame = frames[safeIndex];
    const nextFrame = frames[safeIndex + 1];

    if (!currentFrame || !nextFrame) return null;

    const frameDuration = nextFrame.timestamp - currentFrame.timestamp;
    // Safety for 0 duration frames
    const progress =
      frameDuration > 0 ? Math.min(1, virtualTime / frameDuration) : 1;
    const remaining = Math.max(0, frameDuration - virtualTime);

    return {
      duration: frameDuration,
      elapsed: virtualTime,
      remaining,
      remainingSeconds: Math.ceil(remaining / 1000),
      progress,
    };
  }, [frames, safeIndex, virtualTime, size]);

  const timeBehindLive = useMemo(() => {
    if (size === 0 || !currentData) return 0;
    // If we are tracking live, technically we are 0ms behind for UX purposes
    // but calculating real lag is also useful
    return Date.now() - currentData.timestamp;
  }, [currentData, size]);

  useEffect(() => {
    if (isPaused) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaTime = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      const { frames, currentIndex, size, isTrackingLive } = stateRef.current;

      if (isTrackingLive && currentIndex < size - 1) {
        // Skip animation if we are "Live"
        setCurrentIndex(size - 1);
        setVirtualTime(0);
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (currentIndex >= size - 1) {
        // We are at the head.
        // Ensure tracking is true (in case we arrived here naturally)
        if (!isTrackingLive) setIsTrackingLive(true);
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentFrame = frames[currentIndex];
      const nextFrame = frames[currentIndex + 1];

      if (!currentFrame || !nextFrame) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const frameDuration = nextFrame.timestamp - currentFrame.timestamp;

      setVirtualTime((prevTime) => {
        const newTime = prevTime + deltaTime;
        if (newTime >= frameDuration) {
          setCurrentIndex((idx) => Math.min(idx + 1, size - 1));
          return 0;
        }
        return newTime;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    lastTimestampRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPaused]);

  useEffect(() => {
    // If we haven't loaded anything yet, and data comes in, jump to live
    if (size > 0 && currentIndex === -1) {
      setCurrentIndex(size - 1);
      setIsTrackingLive(true);
    }
  }, [size, currentIndex]);

  const stopTracking = useCallback(() => {
    setIsTrackingLive(false);
  }, []);

  const togglePaused = useCallback(() => {
    setIsPaused((prev) => {
      stopTracking();
      return !prev;
    });
  }, [stopTracking]);

  const goToIndex = useCallback(
    (i: number) => {
      stopTracking();
      const clamped = Math.max(0, Math.min(i, size - 1));
      setCurrentIndex(clamped);
      setVirtualTime(0);
    },
    [size, stopTracking],
  );

  const goBack = useCallback(() => {
    stopTracking();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setVirtualTime(0);
  }, [stopTracking]);

  const goForward = useCallback(() => {
    stopTracking(); // Manual forward breaks "Live" until we hit the end
    setCurrentIndex((prev) => {
      const nextIdx = Math.min(prev + 1, size - 1);
      // If user manually steps to the very end, we can re-enable tracking
      if (nextIdx === size - 1) {
        setIsTrackingLive(true);
      }
      return nextIdx;
    });
    setVirtualTime(0);
  }, [size, stopTracking]);

  const goToStart = useCallback(() => {
    stopTracking();
    setCurrentIndex(0);
    setVirtualTime(0);
  }, [stopTracking]);

  const goToLive = useCallback(() => {
    setCurrentIndex(size - 1);
    setVirtualTime(0);
    setIsPaused(false);
    setIsTrackingLive(true);
  }, [size]);

  return {
    isLive,
    isPaused,
    isPlaying: !isPaused,
    togglePaused,
    goToIndex,
    goBack,
    goForward,
    goToLive,
    goToStart,
    canGoBack: safeIndex > 0,
    canGoForward: !isLive && safeIndex < size - 1,
    index: safeIndex,
    historyLength: size,
    currentData,
    nextFrameInfo,
    timeBehindLive,
  };
}
