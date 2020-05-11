import React from 'react';
import ReactDOM from 'react-dom';

import 'bulma';

import { PomodoroClock } from './PomodoroClock';

const initialBreak = 5;
const initialSession = 25;

ReactDOM.render(
  <React.StrictMode>
    <PomodoroClock
      initialSession={initialSession}
      initialBreak={initialBreak}
      beepSrcUrl="http://soundbible.com/mp3/Loud_Alarm_Clock_Buzzer-Muk1984-493547174.mp3"
      beepLengthMs={3500}
    />
  </React.StrictMode>,
  document.getElementById('root'),
);
