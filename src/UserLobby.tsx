import { useData } from "./DataContext";
import { cn } from "./lib/utils";

function UserLobby() {
  const { id, players, teams } = useData();

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <p className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-5xl font-black text-transparent selection:bg-transparent">
          Navidad 2023
        </p>
        <ul>
          {teams.map((team) => (
            <li
              className={cn("text-lg", {
                "font-bold": players[id] === team,
              })}
              key={team}
            >
              {team}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default UserLobby;
