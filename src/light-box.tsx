import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Car from "./car";
import "./light-box.css";
import Light from "./light";
import TimingSheet from "./timings-sheet";

const defaultValues = [
  {
    state: "stop",
    id: 1,
  },
  {
    state: "stop",
    id: 2,
  },
  {
    state: "stop",
    id: 3,
  },
  {
    state: "stop",
    id: 4,
  },
  {
    state: "stop",
    id: 5,
  },
];

const WAIT_MESSAGE = `Ready, focus and concentrate...`;
const RACE_MESSAGE = `Lights out and away we go...`;
const REACTTION_MESSAGE = `Reaction time is `;
const HINT_TRIGGER_MESSAGE = `click anywhere in the highlighted section of flood lights`;
const RACE_STARTED = `race_started`;
const RACE_NOT_STARTED = `race_not_started`;
const RACE_COMPLETED = `race_completed`;

const LightBox = () => {
  const [lights, setLights] = useState(defaultValues);
  const [reactionTime, setReactionTime] = useState([]);
  const [raceState, setRaceState] = useState(RACE_NOT_STARTED);
  const [timerPassed, setTimerPassed] = useState(false);
  const [timings, setTimings] = useState([]);

  const timerRef = useRef();
  const raceStartRef = useRef();
  const signalContainerRef = useRef();

  useEffect(() => {
    const animationEndHandler = () => {
      startRace();
    };

    const len = signalContainerRef.current.children.length;
    signalContainerRef.current.children[len - 1].children[0].addEventListener(
      "animationend",
      animationEndHandler,
    );

    () => {
      signalContainerRef.current.children[
        len - 1
      ].children[0].removeEventListener("animationend", animationEndHandler);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(raceStartRef.current);
    };
  }, [lights]);

  const startRace = () => {
    console.log(`calling start race`);
    const randomWaitTime = Math.floor(Math.random() * 2000) + 1;

    raceStartRef.current = setTimeout(() => {
      if (timerPassed) {
        return;
      }
      setTimerPassed(true);
      setLights((lights) =>
        lights.map((light) => ({ ...light, state: "go-go" })),
      );
      setRaceState(RACE_STARTED);
      setReactionTime([performance.now(), reactionTime[1]]);
      clearTimeout(raceStartRef.current);
    }, randomWaitTime);
  };

  const inputHandler = useCallback(() => {
    if (raceState !== RACE_STARTED) {
      return;
    }
    clearTimeout(raceStartRef.current);
    const r = performance.now();
    setReactionTime([reactionTime[0], r]);
    setRaceState(RACE_COMPLETED);
    setTimings((timings) => [...timings, r - reactionTime[0]]);
  }, [reactionTime, raceState]);

  const startOverAgain = () => {
    setLights(defaultValues);
    setReactionTime([]);
    setRaceState(RACE_NOT_STARTED);
    setTimerPassed(false);
  };

  const getMessage = () => {
    if (raceState === RACE_COMPLETED) {
      return (
        <div className="message">
          <h2>{`${REACTTION_MESSAGE} ${Number(reactionTime[1] - reactionTime[0]).toFixed(4)} ms`}</h2>
          <button className="try-again-btn" onClick={startOverAgain}>
            try again
          </button>
        </div>
      );
    } else if (raceState === RACE_STARTED) {
      return (
        <div className="message">
          <h2>{RACE_MESSAGE}</h2>
        </div>
      );
    } else {
      return (
        <div className="message">
          <h2>{WAIT_MESSAGE}</h2>
        </div>
      );
    }
  };

  return (
    <div className={`light-box`}>
      <div className="message">{getMessage()}</div>
      <div
        className={`lights ${raceState === RACE_STARTED ? "highlight" : null}`}
        onClick={inputHandler}
        ref={signalContainerRef}
      >
        <Light key={lights[0].id} state={lights[0].state} />
        <Light key={lights[1].id} state={lights[1].state} />
        <Light key={lights[2].id} state={lights[2].state} />
        <Light key={lights[3].id} state={lights[3].state} />
        <Light key={lights[4].id} state={lights[4].state} />
      </div>
      {raceState === RACE_STARTED ? (
        <div className="hint-message">
          <p>{HINT_TRIGGER_MESSAGE}</p>
        </div>
      ) : null}
      {[RACE_STARTED, RACE_COMPLETED].includes(raceState) ? (
        <div className="car">
          <Car />
        </div>
      ) : null}
      {createPortal(<TimingSheet timings={timings} />, document.body)}
    </div>
  );
};

export default LightBox;
