import { useData } from "./DataContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import SlotCounter from "react-slot-counter";

function TeamsList() {
  const { teams, points } = useData();
  const [animationParent] = useAutoAnimate();

  return (
    <div ref={animationParent}>
      {teams.map((team) => (
        <div key={team} className="grid grid-cols-2">
          <span className="text-2xl font-bold text-blue-300">{team}</span>
          <span className="text-right text-2xl font-bold text-white">
            <SlotCounter value={points[team]} />
          </span>
        </div>
      ))}
    </div>
  );
}

export default TeamsList;
