import Question from "./Question";
import { useData } from "./DataContext";
import { useMemo } from "react";

function FastRound() {
  const { gamesList, page, fastRoundTurn } = useData();

  const game = useMemo(() => gamesList[page], [gamesList, page]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="my-10 text-3xl text-orange-500 transition duration-700">
        <div>Preguntas Rápidas</div>
        {fastRoundTurn && (
          <span className="text-2xl font-bold text-orange-200">
            +{game.points} puntos
          </span>
        )}
      </div>
      <div className="bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-7xl font-medium leading-relaxed text-transparent selection:bg-transparent">
        {fastRoundTurn}
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Question key={page} id={page} question={game.question} isFastRound />
      </div>
    </div>
  );
}

export default FastRound;
