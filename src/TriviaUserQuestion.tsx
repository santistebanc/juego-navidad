import BuzzerButton from "./BuzzerButton";
import { cn } from "./lib/utils";
import { useData } from "./DataContext";

function TriviaUserQuestion() {
  const { id, page, buzz, gameBuzzes, team } = useData();

  const handleClick = () => {
    buzz(id, page);
  };
  const buzzStatus =
    gameBuzzes[0] === team
      ? "first"
      : gameBuzzes.includes(team)
      ? "late"
      : "idle";

  return (
    <div className="text-center">
      <header
        className={cn(
          "flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white",
          {
            "bg-red-800": buzzStatus === "late",
            "bg-yellow-500": buzzStatus === "first",
          }
        )}
      >
        <BuzzerButton onClick={handleClick} />
      </header>
    </div>
  );
}

export default TriviaUserQuestion;
