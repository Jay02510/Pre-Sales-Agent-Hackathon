import { useState, useEffect } from 'react';
import { APP_CONSTANTS } from '../utils/constants';

export function useDebounce<T>(value: T, delay: number = APP_CONSTANTS.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}