import { useData } from "./DataContext";
import AudioVisualizer from "./AudioVisualizer";
import { resouceURL } from "../constants";

function MusicQuestion() {
  const { page, paused } = useData();

  const src = resouceURL(page, ".webm");

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div className="m-5 flex max-h-screen max-w-screen-md flex-col items-center justify-center">
        <span className="text-3xl text-amber-500 transition duration-700">
          ¿Cómo se llama esta canción?
        </span>
      </div>
      <AudioVisualizer key={src} paused={paused} src={src} />
    </div>
  );
}

export default MusicQuestion;
