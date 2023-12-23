import { useCountdown, useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { cn } from "./lib/utils";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { useEffect } from "react";
import { useData } from "./DataContext";
import Loading from "./Loading";
import { s3host } from "../constants";

const audioURL = (id) => s3host + id + ".mp3";

interface Props {
  id: string;
  question: string;
  pause?: boolean;
}

function Question({ question, pause, id }: Props) {
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
      pauseAudio();
    } else if (duration && !finished) {
      startCountdown();
      playAudio();
    }
  }, [pause, isLoading, duration]);

  useEffect(() => {
    const url = audioURL(id);
    if (src !== url) {
      load(url);
    }
    return () => {
      stopAudio();
    };
  }, [src]);

  const questionTime = duration * 1000 - 700;

  const [count, { startCountdown, stopCountdown }] = useCountdown({
    countStart: 0,
    intervalMs: 10,
    countStop: Math.floor(questionTime / 10),
    isIncrement: true,
  });

  const finished = count >= Math.floor(questionTime / 10);

  const words = question.split(" ");
  const timePerWord = questionTime / words.length;

  useEffect(() => {
    if (duration && finished && !playing) {
      togglePause(true);
    }
  }, [duration, playing, finished]);

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
