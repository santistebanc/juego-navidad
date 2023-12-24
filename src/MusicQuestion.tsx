import { useData } from "./DataContext";
import AudioVisualizer from "./AudioVisualizer";
import { resouceURL } from "../constants";
import { useMemo } from "react";

function MusicQuestion() {
  const { page, paused, reset, gamesList } = useData();

  const src = useMemo(() => resouceURL(page, ".webm"), [page]);
  const game = useMemo(() => gamesList[page], [gamesList, page]);

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div className="my-10 text-3xl text-orange-500 transition duration-700">
        <div>Adivina la canción</div>
        <span className="text-2xl font-bold text-orange-200">
          +{game.points} puntos
        </span>
      </div>
      <AudioVisualizer key={src} reset={reset} paused={paused} src={src} />
    </div>
  );
}

export default MusicQuestion;
