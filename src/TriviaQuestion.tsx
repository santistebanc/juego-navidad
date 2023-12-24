import Question from "./Question";
import { useData } from "./DataContext";
import { useMemo } from "react";

function TriviaQuestion() {
  const { page, gamesList } = useData();

  const game = useMemo(() => gamesList[page], [gamesList, page]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="my-10 text-3xl text-orange-500 transition duration-700">
        <div>Pregunta</div>
        <span className="text-2xl font-bold text-orange-200">
          +{game.points} puntos
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Question
          key={page}
          id={page}
          question={game.question}
          image={game.image}
        />
      </div>
    </div>
  );
}

export default TriviaQuestion;
