import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { OrderbookSnapshot } from '../../core';
import { useOrderbookInstance } from '../context';
import { useOrderbookHistory } from './useOrderbookHistory';
import { useOrderbookSnapshot } from './useOrderbookSnapshot';

export function useOrderbookPlayback() {
  const { length, getSnapshot } = useOrderbookHistory();
  const liveSnapshot = useOrderbookSnapshot();
  const [index, setIndex] = useState<number>(length - 1);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (!isPaused && !isPlaying && length > 0) {
      setIndex(length - 1);
    }
  }, [length, isPaused, isPlaying]);

  useEffect(() => {
    if (!isPlaying || isPaused) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const scheduleNext = () => {
      if (index >= length - 1) {
        setIsPlaying(false);
        setIsPaused(false);
        setIndex(length - 1);
        return;
      }

      const currentSnapshot = getSnapshot(index);
      const nextSnapshot = getSnapshot(index + 1);

      if (!currentSnapshot || !nextSnapshot) {
        setIsPlaying(false);
        return;
      }

      const delay = nextSnapshot.timestamp - currentSnapshot.timestamp;

      timeoutRef.current = setTimeout(() => {
        setIndex((i) => i + 1);
      }, delay);
    };

    scheduleNext();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, isPaused, index, length, getSnapshot]);

  const currentSnapshot = useMemo<OrderbookSnapshot>(() => {
    if (length === 0) {
      return liveSnapshot;
    }
    return getSnapshot(index) ?? liveSnapshot;
  }, [length, getSnapshot, index, liveSnapshot]);

  const isLive =
    (index === length - 1 && !isPaused && !isPlaying) || length === 0;

  const goForward = useCallback(() => {
    if (length === 0) return;
    setIsPlaying(false);
    setIndex((i) => {
      const newIndex = Math.min(i + 1, length - 1);
      if (newIndex === length - 1) {
        setIsPaused(false);
      }
      return newIndex;
    });
  }, [length]);

  const goBack = useCallback(() => {
    if (length === 0) return;
    setIsPlaying(false);
    setIsPaused(true);
    setIndex((i) => Math.max(i - 1, 0));
  }, [length]);

  const goToLive = useCallback(() => {
    if (length === 0) return;
    setIsPlaying(false);
    setIsPaused(false);
    setIndex(length - 1);
  }, [length]);

  const goToIndex = useCallback(
    (i: number) => {
      if (length === 0) return;
      setIsPlaying(false);
      const newIndex = Math.max(0, Math.min(i, length - 1));
      setIndex(newIndex);
      setIsPaused(newIndex !== length - 1);
    },
    [length],
  );

  const togglePaused = useCallback(() => {
    if (!isPaused) {
      setIsPaused(true);
      setIsPlaying(false);
    } else {
      setIsPaused(false);
      if (index < length - 1) {
        setIsPlaying(true);
      }
    }
  }, [isPaused, index, length]);

  const play = useCallback(() => {
    setIsPaused(false);
    if (index < length - 1) {
      setIsPlaying(true);
    }
  }, [index, length]);

  const pause = useCallback(() => {
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  return {
    currentSnapshot,
    index,
    isLive,
    isPaused,
    isPlaying,
    goForward,
    goBack,
    goToLive,
    goToIndex,
    setIsPaused,
    togglePaused,
    play,
    pause,
    canGoBack: index > 0 && length > 0,
    canGoForward: index < length - 1 && length > 0,
  };
}
