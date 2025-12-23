import { useCallback, useEffect, useState } from 'react';

export function useBufferedSetting<T extends string | number | undefined>(
  globalValue: T,
  setGlobalValue: (value: T) => void,
  transform?: (val: string) => T,
) {
  const [localValue, setLocalValue] = useState(String(globalValue ?? ''));

  useEffect(() => {
    setLocalValue(String(globalValue ?? ''));
  }, [globalValue]);

  const handleApply = useCallback(() => {
    const finalValue = transform
      ? transform(localValue)
      : (Number(localValue) as T);
    setGlobalValue(finalValue);
  }, [localValue, setGlobalValue, transform]);

  const isDirty = String(globalValue ?? '') !== localValue;
  const isValid = localValue !== '' && !Number.isNaN(Number(localValue));

  return {
    localValue,
    setLocalValue,
    apply: handleApply,
    isDirty,
    isValid,
  };
}
