import React from 'react';
import ReactDOM from 'react-dom';

import {
  PomodoroClock,
  defaultInitialSession,
  defaultInitialBreak,
  defaultBeepSrcUrl,
  defaultBeepLengthMs,
} from './PomodoroClock';

import 'bulma';

ReactDOM.render(
  <React.StrictMode>
    <PomodoroClock
      initialSession={defaultInitialSession}
      initialBreak={defaultInitialBreak}
      beepSrcUrl={defaultBeepSrcUrl}
      beepLengthMs={defaultBeepLengthMs}
    />
  </React.StrictMode>,
  document.getElementById('root'),
);
