import { Team, Trivia } from "../interfaces";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button } from "./components/ui/button";
import PartySocket from "partysocket";
import Question from "./Question";

interface Props {
  partySocket: PartySocket;
  data: Trivia;
  buzzes: Team[];
}

function TriviaQuestion({ partySocket, data, buzzes }: Props) {
  const [animationParent] = useAutoAnimate();
  const [animationParent2] = useAutoAnimate();

  const resetClick = () => {
    partySocket.send(
      JSON.stringify({
        type: "update",
        game: null,
      })
    );
  };

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <Question
          question={data.question}
          questionTime={3000}
          pause={!!buzzes.length}
        />
        <div className="mt-16">
          {buzzes[0] && (
            <>
              <ul ref={animationParent2}>
                {buzzes[0] && (
                  <li className="bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text text-9xl font-medium leading-relaxed text-transparent selection:bg-transparent">
                    {buzzes[0].name}
                  </li>
                )}
              </ul>
              <ul className="text-right" ref={animationParent}>
                {buzzes.slice(1).map((buzz) => (
                  <li
                    className="text-3xl font-medium text-blue-600"
                    key={buzz.name}
                  >
                    {buzz.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <Button
          onClick={resetClick}
          variant="outline"
          className="mt-8 border-red-800 bg-transparent hover:bg-gray-800 hover:text-red-50"
          style={{ position: "absolute", bottom: "20px", right: "20px" }}
        >
          Reset
        </Button>
      </header>
    </div>
  );
}

export default TriviaQuestion;
