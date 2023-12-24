import BuzzerButton from "./BuzzerButton";
import { cn } from "./lib/utils";
import { useData } from "./DataContext";
import SlotCounter from "react-slot-counter";

function TriviaUserQuestion() {
  const { id, page, buzz, gameBuzzes, team, points } = useData();

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
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-center text-white",
        {
          "bg-red-800": buzzStatus === "late",
          "bg-yellow-500": buzzStatus === "first",
        }
      )}
    >
      <div className="flex gap-10 p-4">
        <span
          className={cn("text-2xl font-bold text-blue-300", {
            "text-blue-600": buzzStatus === "first",
          })}
        >
          {team}
        </span>
        <span
          className={cn("text-right text-2xl font-bold text-white", {
            "text-black": buzzStatus === "first",
          })}
        >
          <SlotCounter value={points[team]} />
        </span>
      </div>
      <div className="flex-1">
        <BuzzerButton onClick={handleClick} />
      </div>
    </div>
  );
}

export default TriviaUserQuestion;
