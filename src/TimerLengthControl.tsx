import React, { ReactElement } from 'react';

interface TimerLengthControlProps {
  decrement: () => void;
  increment: () => void;
  timerType: TimerType;
  timerLength: number;
}

type TimerType = 'session' | 'break';

export function TimerLengthControl({
  decrement,
  increment,
  timerType,
  timerLength,
}: TimerLengthControlProps): ReactElement<TimerLengthControlProps> {
  return (
    <div className="column">
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
}
