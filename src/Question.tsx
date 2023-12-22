import { useCountdown, useEffectOnce, useUpdateEffect } from "usehooks-ts";
import { cn } from "./lib/utils";
import useSound from "use-sound";
import q1 from "./assets/sounds/wii.webm";

interface Props {
  question: string;
  pause?: boolean;
  questionTime: number;
}

function Question({ question, questionTime, pause }: Props) {
  const [play, { stop }] = useSound(q1);

  useEffectOnce(() => {
    startCountdown();
    play();
  });
  useUpdateEffect(() => {
    if (pause) {
      stopCountdown();
      stop();
    } else {
      startCountdown();
      // play();
    }
  }, [pause]);

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: questionTime / 10,
      intervalMs: 10,
    });

  const words = question.split(" ");
  const timePerWord = questionTime / words.length;

  return (
    <div className="max-w-screen-md">
      {words.map((word, i) => (
        <span
          key={word}
          className={cn("text-3xl text-transparent transition duration-700", {
            "text-amber-500": questionTime - count * 10 > timePerWord * i,
          })}
        >
          {word}{" "}
        </span>
      ))}
    </div>
  );
}

export default Question;
