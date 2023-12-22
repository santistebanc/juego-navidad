import { useCountdown, useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { cn } from "./lib/utils";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import q1 from "./assets/sounds/q1.mp3";
import { useEffect } from "react";
import { useData } from "./DataContext";
import Loading from "./Loading";

interface Props {
  question: string;
  pause?: boolean;
}

function Question({ question, pause }: Props) {
  const { togglePause } = useData();
  const {
    load,
    play: playAudio,
    pause: pauseAudio,
    duration,
    playing,
    stop: stopAudio,
    isLoading,
    src,
  } = useGlobalAudioPlayer();

  useEffect(() => {
    if (pause) {
      stopCountdown();
      // pauseAudio();
    } else if (duration) {
      startCountdown();
      // playAudio();
    }
    return () => {
      // stopAudio();
    };
  }, [pause, playing, isLoading, duration]);

  useEffect(() => {
    if (src !== q1) {
      load(q1);
    }
  }, [src]);

  const questionTime = duration * 1000 - 700;

  const [count, { startCountdown, stopCountdown }] = useCountdown({
    countStart: 0,
    intervalMs: 10,
    countStop: Math.floor(questionTime / 10),
    isIncrement: true,
  });

  const words = question.split(" ");
  const timePerWord = questionTime / words.length;

  if (isLoading || !duration) return <Loading />;

  return (
    <div className="max-w-screen-md">
      {words.map((word, i) => (
        <span
          key={word}
          className={cn("text-3xl text-transparent transition duration-700", {
            "text-amber-500": count * 10 > timePerWord * i,
          })}
        >
          {word}{" "}
        </span>
      ))}
    </div>
  );
}

export default Question;
