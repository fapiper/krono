import { intervalToDuration } from 'date-fns';

export const formatDistanceInterval = (
  laterDate: number,
  earlierDate: number,
) => {
  const diffMs = Math.max(0, earlierDate - laterDate);
  const duration = intervalToDuration({ start: 0, end: diffMs });

  const zeroPad = (num?: number) => String(num ?? 0).padStart(2, '0');

  if ((duration.hours ?? 0) > 0) {
    return `${zeroPad(duration.hours)}:${zeroPad(duration.minutes)}:${zeroPad(
      duration.seconds,
    )}`;
  }

  return `${zeroPad(duration.minutes)}:${zeroPad(duration.seconds)}`;
};
