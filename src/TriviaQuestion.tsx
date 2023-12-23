import { useAutoAnimate } from "@formkit/auto-animate/react";
import Question from "./Question";
import { useData } from "./DataContext";
import { useMemo } from "react";

function TriviaQuestion() {
  const { page, paused, gameBuzzes, gamesList } = useData();
  const [animationParent] = useAutoAnimate();
  const [animationParent2] = useAutoAnimate();

  const game = useMemo(() => gamesList[page], [gamesList, page]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-center text-white">
      <Question key={page} id={page} question={game.question} pause={paused} />
      <div className="mt-16">
        {gameBuzzes?.[0] && (
          <>
            <ul ref={animationParent2}>
              {gameBuzzes[0] && (
                <li className="bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-9xl font-medium leading-relaxed text-transparent selection:bg-transparent">
                  {gameBuzzes[0]}
                </li>
              )}
            </ul>
            <ul className="text-right" ref={animationParent}>
              {gameBuzzes.slice(1).map((buzz) => (
                <li className="text-3xl font-medium text-blue-600" key={buzz}>
                  {buzz}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default TriviaQuestion;
