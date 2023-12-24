import { useCountdown, useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { cn } from "./lib/utils";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import { useEffect } from "react";
import { useData } from "./DataContext";
import Loading from "./Loading";
import { resouceURL } from "../constants";

interface Props {
  id: string;
  question: string;
  image?: string;
}

function Question({ question, id, image }: Props) {
  const { reset, paused } = useData();
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
  }, []);

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
    </div>
  );
}

export default Question;
