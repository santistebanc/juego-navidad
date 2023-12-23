import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useData } from "./DataContext";
import { useAudioPlayer } from "react-use-audio-player";
import { useEffect, useState } from "react";
import buzzerSound from "./assets/sounds/buzzer.mp3";

function GameBuzzes() {
  const { gameBuzzes } = useData();
  const [animationParent] = useAutoAnimate();
  const [animationParent2] = useAutoAnimate();
  const { load, play: playAudio, stop: stopAudio } = useAudioPlayer();

  const [readySound, setReadySound] = useState(false);

  useEffect(() => {
    if (!!gameBuzzes?.length) {
      load(buzzerSound);
      setReadySound(true);
    }
    if (gameBuzzes.length && readySound) {
      playAudio();
    }
    return () => {
      stopAudio();
    };
  }, [gameBuzzes]);

  return (
    <div className="flex min-h-screen flex-col pt-24">
      <ul ref={animationParent2}>
        {gameBuzzes[0] && (
          <li className="bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-7xl font-medium leading-relaxed text-transparent selection:bg-transparent">
            {gameBuzzes[0]}
          </li>
        )}
      </ul>
      <ul className="text-right" ref={animationParent}>
        {gameBuzzes.slice(1).map((buzz) => (
          <li className="text-3xl font-medium text-cyan-600" key={buzz}>
            {buzz}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameBuzzes;
