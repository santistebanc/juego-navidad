import { games } from "../games";
import { useData } from "./DataContext";
import GamesTable from "./GamesTable";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { cn } from "./lib/utils";

function Admin() {
  const {
    goToPage,
    clearBuzzes,
    page,
    togglePause,
    paused,
    gameBuzzes,
    givePoints,
  } = useData();

  const startClick = () => {
    goToPage(page === "lobby" ? Object.keys(games)[0] : "lobby");
  };

  const resetClick = () => {
    clearBuzzes(page);
    goToPage("lobby");
  };

  const pauseClick = () => {
    togglePause();
  };

  const awardPoints = (team: string, points: number) => () => {
    givePoints(team, points);
  };

  const game = games[page];

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#282c34] text-white">
        <GamesTable />
        <div className="flex gap-4">
          <Button onClick={startClick} className="bg-red-800 hover:bg-red-900">
            {page === "lobby" ? "Start" : "Go to Lobby"}
          </Button>
          <Button
            onClick={resetClick}
            variant="outline"
            className="border-red-800 bg-transparent hover:bg-gray-800 hover:text-red-50"
          >
            Reset
          </Button>
          <Button
            onClick={pauseClick}
            variant="outline"
            className="border-blue-800 bg-transparent hover:bg-gray-800 hover:text-blue-50"
          >
            {paused ? "▶" : "▐▐"}
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {game &&
            gameBuzzes.map((buzz, i) => (
              <div className="grid auto-cols-auto grid-flow-col items-center gap-2">
                <Badge
                  className={cn("border-yellow-500 font-bold text-yellow-600", {
                    "border-red-500 text-red-600": i > 0,
                  })}
                  variant="outline"
                >
                  {i + 1}
                </Badge>
                <div className="px-3">{buzz}</div>
                <Button
                  onClick={awardPoints(buzz, game.points)}
                  variant="outline"
                  className="h-auto border-gray-200 bg-transparent p-1 hover:bg-gray-600 hover:text-blue-50"
                >
                  {`+ ${game.points}`}
                </Button>
                <Button
                  onClick={awardPoints(buzz, -game.points)}
                  variant="outline"
                  className="h-auto border-red-800 bg-transparent p-1 hover:bg-red-900 hover:text-blue-50"
                >
                  {`- ${game.points}`}
                </Button>
              </div>
            ))}
        </div>
      </header>
    </div>
  );
}

export default Admin;
