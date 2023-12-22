import { useData } from "./DataContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function TeamsList() {
  const { teams, points } = useData();
  const [animationParent] = useAutoAnimate();

  console.log(points);

  return (
    <div className="flex min-h-screen flex-col p-10">
      <div className="grid grid-flow-row grid-cols-2" ref={animationParent}>
        {teams.map((team) => (
          <>
            <div key={team} className="text-2xl font-bold text-blue-300">
              {team}
            </div>
            <span
              key={team + " points"}
              className="text-right text-2xl font-bold text-white"
            >
              {points[team]}
            </span>
          </>
        ))}
      </div>
    </div>
  );
}

export default TeamsList;
