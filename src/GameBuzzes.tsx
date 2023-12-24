import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useData } from "./DataContext";
import { useAudioPlayer } from "react-use-audio-player";
import { useEffect, useState } from "react";
import buzzerSound from "./assets/sounds/buzzer.mp3";
import { cn } from "./lib/utils";

function GameBuzzes() {
  const { gameBuzzes, answers, page } = useData();
  const [animationParent] = useAutoAnimate();
  const { load, play: playAudio, stop: stopAudio } = useAudioPlayer();

  const [readySound, setReadySound] = useState(false);

  useEffect(() => {
    if (!gameBuzzes?.length) {
      setReadySound(true);
    }
    if (gameBuzzes.length && readySound) {
      setReadySound(false);
      playAudio();
    }
  }, [gameBuzzes]);

  useEffect(() => {
    load(buzzerSound);
    return () => {
      stopAudio();
    };
  }, []);

  const turn = gameBuzzes.findIndex((buzz) => answers?.[page]?.[buzz] !== -1);

  return (
    <div className="flex min-h-screen flex-col px-12 pt-24">
      <ul className="flex flex-col text-right" ref={animationParent}>
        {gameBuzzes.map((buzz, i) => (
          <li
            className={cn("text-3xl font-medium text-cyan-600", {
              "bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-7xl font-medium leading-relaxed text-transparent selection:bg-transparent":
                i === turn,
              "text-red-600 line-through": answers?.[page]?.[buzz] === -1,
            })}
            key={buzz}
          >
            {buzz}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameBuzzes;
