import React, { ReactElement } from 'react';

type TimerType = 'session' | 'break';

interface TimerLengthControlProps {
  decrement: () => void;
  increment: () => void;
  timerType: TimerType;
  timerLength: number;
}

export const TimerLengthControl = React.memo(function TimerLengthControl({
  decrement,
  increment,
  timerType,
  timerLength,
}: TimerLengthControlProps): ReactElement<TimerLengthControlProps> {
  return (
    <div className="column is-narrow">
      <p id={`${timerType}-label`} className="is-capitalized">
        {timerType} Length: <span id={`${timerType}-length`}>{timerLength}</span>
      </p>
      <div className="buttons">
        <button onClick={decrement} id={`${timerType}-decrement`} className="button is-warning">
          Decrement
        </button>
        <button onClick={increment} id={`${timerType}-increment`} className="button is-info">
          Increment
        </button>
      </div>
    </div>
  );
});
