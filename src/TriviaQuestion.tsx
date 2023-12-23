import { useAutoAnimate } from "@formkit/auto-animate/react";
import Question from "./Question";
import { useData } from "./DataContext";
import { useMemo } from "react";

function TriviaQuestion() {
  const { page, gamesList } = useData();

  const game = useMemo(() => gamesList[page], [gamesList, page]);

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <Question
        key={page}
        id={page}
        question={game.question}
        image={game.image}
      />
    </div>
  );
}

export default TriviaQuestion;
