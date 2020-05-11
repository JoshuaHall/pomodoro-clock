export function accurateInterval(
  func: (scheduledTime: number) => void,
  interval: number,
  opts: { aligned?: boolean; immediate?: boolean } = {},
): () => void {
  const now: number = new Date().getTime();

  let nextAt = now;

  if (opts.aligned) {
    nextAt += interval - (now % interval);
  }

  if (!opts.immediate) {
    nextAt += interval;
  }

  let timeout: number | undefined = undefined;

  const wrapper = function (): void {
    const scheduledTime = nextAt;
    nextAt += interval;
    timeout = window.setTimeout(wrapper, nextAt - new Date().getTime());
    func(scheduledTime);
  };

  const clear = function (): void {
    clearTimeout(timeout);
  };

  timeout = window.setTimeout(wrapper, nextAt - new Date().getTime());

  return clear;
}
