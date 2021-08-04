import React, { useState, useEffect } from "react";
import { Subject, interval, takeUntil } from "rxjs";

const App = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const stream = new Subject();

    if (isActive && !isPaused) {
      interval(1000)
        .pipe(takeUntil(stream))
        .subscribe(() => {
          setSeconds((seconds) => seconds + 1);

          if (seconds === 59) {
            setMinutes((minutes) => minutes + 1);
            setSeconds(0);
          }

          if (minutes === 59 && seconds === 59) {
            setHours((hours) => hours + 1);
            setMinutes(0);
          }
        });
    }

    return () => {
      stream.next();
      stream.complete();
    };
  });

  function handleStart() {
    setIsPaused(false);
    setIsActive(true);
  }

  function handleReset() {
    setMinutes(0);
    setSeconds(0);
    setHours(0);
  }

  function handleStop() {
    if (isActive) {
      setIsActive(!isActive);
    }
    setIsPaused(!isPaused);
    console.log(isPaused);

    handleReset();
  }

  let clicks = 0;

  function handlePause() {
    clicks++;
    console.log(clicks);

    const timeout = setTimeout(() => {
      clicks = 0;
    }, 300);

    if (clicks >= 2) {
      setIsPaused(true);
      clearTimeout(timeout);
      clicks = 0;
    }
  }

  return (
    <>
      <span>{hours < 10 ? "0" + hours + ":" : hours + ":"}</span>
      <span>{minutes < 10 ? "0" + minutes + ":" : minutes + ":"}</span>
      <span>{seconds < 10 ? "0" + seconds : seconds}</span>
      <br />
      <button type="button" onClick={handleStart}>
        START
      </button>
      <button type="button" onClick={handleStop}>
        STOP
      </button>
      <button type="button" onClick={handleReset}>
        RESET
      </button>
      <button type="button" onClick={handlePause}>
        WAIT
      </button>
    </>
  );
};

export default App;
