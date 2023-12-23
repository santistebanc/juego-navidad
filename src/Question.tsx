import { useCountdown, useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { cn } from "./lib/utils";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { useEffect } from "react";
import { useData } from "./DataContext";
import Loading from "./Loading";
import { s3host } from "../constants";

const resouceURL = (id: string, postfix?: string) =>
  s3host + id + (postfix ?? "");

interface Props {
  id: string;
  question: string;
  image?: string;
}

function Question({ question, id, image }: Props) {
  const { togglePause, reset, paused } = useData();
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

  const questionTime = duration * 1000 - 1400;

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 0,
      intervalMs: 10,
      countStop: Math.floor(questionTime / 10),
      isIncrement: true,
    });

  const finished = count >= Math.floor(questionTime / 10);

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
  }, [paused, duration, reset, finished]);

  useEffect(() => {
    const url = resouceURL(id, ".mp3");
    if (src !== url) {
      load(url);
    }
    return () => {
      stopAudio();
    };
  }, [src]);

  const words = question.split(" ");
  const timePerWord = questionTime / words.length;

  useEffect(() => {
    if (duration && finished && !playing) {
      togglePause(true);
    }
  }, [duration, playing, finished]);

  if (isLoading || !duration) return <Loading />;

  return (
    <div className="m-5 flex max-h-screen max-w-screen-md flex-col items-center justify-center">
      <div>
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
    </div>
  );
}

export default Question;
