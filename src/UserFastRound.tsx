import { useData } from "./DataContext";
import SlotCounter from "react-slot-counter";

function UserFastRound() {
  const { points, team, fastRoundTurn } = useData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#282c34] text-center text-white">
      <p className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-5xl font-black text-transparent selection:bg-transparent">
        Preguntas Rápidas
      </p>
      <div className="flex gap-10 p-4">
        <span className="text-2xl font-bold text-blue-300">{team}</span>
        <span className="text-right text-2xl font-bold text-white">
          <SlotCounter value={points[team]} />
        </span>
      </div>
    </div>
  );
}

export default UserFastRound;
