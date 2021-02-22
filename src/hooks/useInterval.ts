import { useRef, useEffect } from 'react';

import { accurateInterval } from '../accurateInterval';

// Inspired by https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      savedCallback.current?.();
    }

    if (delay !== null) {
      return accurateInterval(tick, delay);
    }
  }, [delay]);
}
