import React, { useState, useRef, ReactElement, useCallback } from 'react';
import { useInterval } from './hooks/useInterval';

import { TimerLengthControl } from './TimerLengthControl';

// In minutes
const minimumLength = 1;
const maximumLength = 60;

function increment(num: number): number {
  return num + 1;
}

function decrement(num: number): number {
  return num - 1;
}

function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

function clampedIncrement(num: number): number {
  return clamp(increment(num), minimumLength, maximumLength);
}

function clampedDecrement(num: number): number {
  return clamp(decrement(num), minimumLength, maximumLength);
}

function secondsToMmSs(seconds: number): string {
  const minutesStr: string = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');

  const secondsStr: string = (seconds % 60).toString().padStart(2, '0');

  return minutesStr + ':' + secondsStr;
}

function toggle(bool: boolean): boolean {
  return !bool;
}

function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

enum ClockState {
  Session,
  Break,
}

export const defaultInitialSession = 25;
export const defaultInitialBreak = 5;
export const defaultBeepSrcUrl = 'https://soundbible.com/mp3/Loud_Alarm_Clock_Buzzer-Muk1984-493547174.mp3';
export const defaultBeepLengthMs = 3500;

interface PomodoroClockProps {
  initialSession: number;
  initialBreak: number;
  beepSrcUrl: string;
  beepLengthMs: number;
}

export function PomodoroClock({
  initialSession,
  initialBreak,
  beepSrcUrl,
  beepLengthMs,
}: PomodoroClockProps): ReactElement {
  const initialTimeLeft = minutesToSeconds(initialSession);

  const [sessionLength, setSessionLength] = useState(initialSession);
  const [breakLength, setBreakLength] = useState(initialBreak);

  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  const [isCounting, setIsCounting] = useState(false);

  const [clockState, setClockState] = useState(ClockState.Session);

  const audioBeepNode = useRef<HTMLAudioElement>(null);

  const decrementBreak = useCallback((): void => {
    if (!isCounting) {
      const newBreakLength = clampedDecrement(breakLength);

      setBreakLength(newBreakLength);

      if (clockState === ClockState.Break) {
        setTimeLeft(minutesToSeconds(newBreakLength));
      }
    }
  }, [breakLength, clockState, isCounting]);

  const incrementBreak = useCallback((): void => {
    if (!isCounting) {
      const newBreakLength = clampedIncrement(breakLength);

      setBreakLength(newBreakLength);

      if (clockState === ClockState.Break) {
        setTimeLeft(minutesToSeconds(newBreakLength));
      }
    }
  }, [breakLength, clockState, isCounting]);

  const decrementSession = useCallback((): void => {
    if (!isCounting) {
      const newSessionLength = clampedDecrement(sessionLength);

      setSessionLength(newSessionLength);

      if (clockState === ClockState.Session) {
        setTimeLeft(minutesToSeconds(newSessionLength));
      }
    }
  }, [clockState, isCounting, sessionLength]);

  const incrementSession = useCallback((): void => {
    if (!isCounting) {
      const newSessionLength = clampedIncrement(sessionLength);

      setSessionLength(newSessionLength);

      if (clockState === ClockState.Session) {
        setTimeLeft(minutesToSeconds(newSessionLength));
      }
    }
  }, [clockState, isCounting, sessionLength]);

  const toggleIsCounting = useCallback((): void => {
    setIsCounting(toggle);
  }, []);

  const resetAudioBeep = useCallback((): void => {
    if (audioBeepNode.current !== null) {
      audioBeepNode.current.pause();
      audioBeepNode.current.currentTime = 0;
    }
  }, []);

  const reset = useCallback((): void => {
    setBreakLength(initialBreak);
    setSessionLength(initialSession);
    setTimeLeft(initialTimeLeft);
    setIsCounting(false);
    setClockState(ClockState.Session);

    resetAudioBeep();
  }, [initialBreak, initialSession, initialTimeLeft, resetAudioBeep]);

  useInterval(
    () => {
      setTimeLeft(decrement);

      if (timeLeft <= 0) {
        audioBeepNode.current
          ?.play()
          .then(() => {
            setTimeout(() => {
              resetAudioBeep();
            }, beepLengthMs);
          })
          .catch(console.error);

        if (clockState === ClockState.Session) {
          setClockState(ClockState.Break);
          setTimeLeft(minutesToSeconds(breakLength));
        } else {
          setClockState(ClockState.Session);
          setTimeLeft(minutesToSeconds(sessionLength));
        }
      }
    },
    isCounting ? 1000 : null,
  );

  return (
    <>
      <h1 className="title has-text-centered">Pomodoro Clock</h1>
      <div className="columns is-centered">
        <TimerLengthControl
          timerType="break"
          timerLength={breakLength}
          decrement={decrementBreak}
          increment={incrementBreak}
        />
        <TimerLengthControl
          timerType="session"
          timerLength={sessionLength}
          decrement={decrementSession}
          increment={incrementSession}
        />
      </div>
      <div className="columns is-centered">
        <div className="column is-narrow">
          <div id="timer-label">{clockState === ClockState.Session ? 'Session' : 'Break'}</div>
          <div id="time-left">{secondsToMmSs(timeLeft)}</div>
          <audio id="beep" ref={audioBeepNode} preload="auto" src={beepSrcUrl}></audio>
        </div>
      </div>
      <div className="columns is-centered">
        <div className="column is-narrow">
          <button id="start_stop" onClick={toggleIsCounting} className="button is-primary">
            Start/Stop
          </button>
        </div>
        <div className="column is-narrow">
          <button id="reset" onClick={reset} className="button is-danger">
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
