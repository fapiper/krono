import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { OrderbookData } from '../../core';
import { useOrderbookInstance } from '../context';
import { useOrderbookData } from './useOrderbookData';
import { useOrderbookHistory } from './useOrderbookHistory';

export function useOrderbookPlayback() {
  const { length, getData } = useOrderbookHistory();
  const liveData = useOrderbookData();
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

      const currentData = getData(index);
      const nextData = getData(index + 1);

      if (!currentData || !nextData) {
        setIsPlaying(false);
        return;
      }

      const delay = nextData.timestamp - currentData.timestamp;

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
  }, [isPlaying, isPaused, index, length, getData]);

  const currentData = useMemo<OrderbookData>(() => {
    if (length === 0) {
      return liveData;
    }
    return getData(index) ?? liveData;
  }, [length, getData, index, liveData]);

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
    currentData,
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
