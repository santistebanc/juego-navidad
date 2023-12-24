import { GameEffect } from "interfaces";
import { Checkmark } from "react-checkmark";
import { useData } from "./DataContext";
import { useCountdown } from "usehooks-ts";
import { useEffect } from "react";
import { cn } from "./lib/utils";
import { ImCross } from "react-icons/im";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useAudioPlayer } from "react-use-audio-player";
import correctSound from "./assets/sounds/correct.wav";
import wrongSound from "./assets/sounds/incorrect.mp3";

const ShowGameEffect = () => {
  const { gameEffect, triggerEffect } = useData();
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 0,
    intervalMs: 100,
    countStop: gameEffect === "timer" ? 70 : 30,
    isIncrement: true,
  });
  const { load, play: playAudio, stop: stopAudio } = useAudioPlayer();

  useEffect(() => {
    if (gameEffect !== "none") {
      resetCountdown();
      startCountdown();
      if (gameEffect === "correct") {
        load(correctSound);
        playAudio();
      } else if (gameEffect === "wrong") {
        load(wrongSound);
        playAudio();
      }
    }
    return () => {
      stopAudio();
    };
  }, [gameEffect]);

  useEffect(() => {
    console.log(count);
    if (
      (gameEffect === "timer" && count >= 70) ||
      (gameEffect !== "timer" && count >= 30)
    ) {
      resetCountdown();
      triggerEffect("none");
    }
  }, [count]);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {gameEffect === "correct" && (
        <div
          className={cn("opacity-100 transition-opacity duration-1000", {
            "opacity-0": count >= 20,
          })}
        >
          <Checkmark size="50dvmin" color="rgba(122, 193, 66, 0.8)" />
        </div>
      )}
      {gameEffect === "wrong" && (
        <div
          style={{ fontSize: "25rem" }}
          className={cn(
            "text-red-600 opacity-100 transition-opacity duration-1000",
            {
              "opacity-0": count >= 20,
            }
          )}
        >
          <ImCross />
        </div>
      )}
      {gameEffect === "timer" && (
        <div
          style={{ fontSize: "20rem" }}
          className={cn(
            "font-black text-lime-400 opacity-100 transition-opacity duration-1000",
            {
              "opacity-0": count >= 60,
            }
          )}
        >
          <CountdownCircleTimer
            size={400}
            isPlaying
            duration={5}
            strokeWidth={30}
            colors="rgb(163 230 53)"
            trailColor="rgba(185, 208, 148, 0.5)"
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>
      )}
    </div>
  );
};

export default ShowGameEffect;
