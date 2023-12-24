import { useCountdown, useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { cn } from "./lib/utils";
import { useAudioPlayer, useGlobalAudioPlayer } from "react-use-audio-player";
import { useEffect, useState } from "react";
import { useData } from "./DataContext";
import Loading from "./Loading";
import { resouceURL } from "../constants";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import timer3 from "./assets/sounds/Timer3.mp3";

interface Props {
  id: string;
  question: string;
  image?: string;
  isFastRound?: boolean;
  onFinishTimer?: () => void;
}

function Question({ question, id, image, isFastRound, onFinishTimer }: Props) {
  const { reset, paused } = useData();
  const {
    load,
    play: playAudio,
    pause: pauseAudio,
    duration,
    stop: stopAudio,
    isLoading,
    src,
  } = useGlobalAudioPlayer();

  const {
    load: loadTimer,
    play: playTimerAudio,
    stop: stopTimerAudio,
  } = useAudioPlayer();

  const questionTime = duration * 1000 - 1400;

  const timerAmount = isFastRound ? 3000 : 0;

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 0,
      intervalMs: 10,
      countStop: Math.floor(questionTime / 10) + timerAmount / 10,
      isIncrement: true,
    });

  const finishedQuestion = count >= Math.floor(questionTime / 10);

  const finished = count >= Math.floor(questionTime + timerAmount / 10);

  useEffect(() => {
    if (reset) {
      stopAudio();
      resetCountdown();
    }
    if (paused) {
      stopCountdown();
      pauseAudio();
    } else if (duration && !finished) {
      startCountdown();
      playAudio();
    }
    if (finished) {
      onFinishTimer?.();
    }
  }, [paused, duration, reset, finished]);

  const [resetState, setResetState] = useState(false);

  const [playedOnce, setPlayedOnce] = useState(false);

  useEffect(() => {
    if (reset) {
      setResetState(!resetState);
      stopTimerAudio();
    }
    if (paused) {
    } else if (finishedQuestion && !finished && isFastRound && !playedOnce) {
      playTimerAudio();
      setPlayedOnce(true);
    }
  }, [finishedQuestion]);

  useEffect(() => {
    if (isFastRound && !playedOnce) {
      loadTimer(timer3);
    }
    const url = resouceURL(id, ".mp3");
    if (src !== url) {
      load(url);
    }
    return () => {
      stopAudio();
      stopTimerAudio();
    };
  }, [isFastRound]);

  const words = question.split(" ");
  const timePerWord = questionTime / words.length;

  if (isLoading || !duration) return <Loading />;

  return (
    <div className="flex max-w-screen-md flex-col items-center justify-center">
      <div>
        {words.map((word, i) => (
          <span
            key={word + "+" + i}
            className={cn("text-5xl text-transparent transition duration-700", {
              "text-amber-500": count * 10 > timePerWord * i,
            })}
          >
            {word}{" "}
          </span>
        ))}
      </div>
      {image && (
        <img
          src={resouceURL(image)}
          className={cn(
            "mt-5 max-w-lg opacity-0 transition-opacity duration-700 ease-in",
            {
              "opacity-100": finished,
            }
          )}
        />
      )}
      {isFastRound && (
        <div
          style={{ fontSize: "7rem" }}
          className="mt-12 font-black text-slate-400"
        >
          <CountdownCircleTimer
            key={String(resetState)}
            size={200}
            isPlaying={finishedQuestion}
            duration={timerAmount / 1000}
            strokeWidth={20}
            colors="#004777"
            trailColor="rgba(148 163 184, 0.5)"
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>
      )}
    </div>
  );
}

export default Question;
