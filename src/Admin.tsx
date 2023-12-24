import { useData } from "./DataContext";
import GamesTable from "./GamesTable";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { cn } from "./lib/utils";
import ManualPoints from "./ManualPoints";
import { Table, TableBody, TableCell, TableRow } from "./components/ui/table";

function Admin() {
  const {
    goToPage,
    resetGame,
    page,
    togglePause,
    paused,
    gameBuzzes,
    gamesList,
    triggerEffect,
    giveAnswer,
    games,
    teams,
    fastRoundTurn,
  } = useData();

  const game = gamesList[page];

  const isFastRound = false;

  const otherTeams = teams.filter(
    (t) => !gameBuzzes.includes(t) && fastRoundTurn !== t
  );

  const startClick = () => {
    const normalGames = games.filter((g) => gamesList[g].type !== "flash");
    if (page === "lobby") {
      goToPage("lobby");
    } else {
      goToPage(normalGames[0]);
    }
  };

  const resetClick = () => {
    resetGame(page);
  };

  const pauseClick = () => {
    togglePause();
  };

  const correctClick = () => {
    triggerEffect("correct");
  };

  const wrongClick = () => {
    triggerEffect("wrong");
  };

  const timeClick = () => {
    triggerEffect("timer");
  };

  const nextClick = () => {
    const fastRoundGames = games.filter((g) => gamesList[g].type === "flash");
    const normalGames = games.filter((g) => gamesList[g].type !== "flash");
    if (isFastRound) {
      const idx = fastRoundGames.indexOf(page) + 1;
      if (idx >= fastRoundGames.length) {
        goToPage("finish");
      } else {
        goToPage(fastRoundGames[fastRoundGames.indexOf(page) + 1]);
      }
    } else {
      const idx = normalGames.indexOf(page) + 1;
      if (idx >= normalGames.length) {
        goToPage("fastRound");
      } else {
        goToPage(normalGames[idx]);
      }
    }
  };

  const clickCorrectAnswer = (team: string) => () => {
    giveAnswer(page, team, 1, game.points);
  };

  const clickWrongAnswer = (team: string) => () => {
    giveAnswer(page, team, -1, isFastRound ? 0 : -Math.round(game.points / 2));
  };

  const clickFastRound = () => {
    if (page === "fastRound") {
      const fastRoundGames = games.filter((g) => gamesList[g].type === "flash");
      goToPage(fastRoundGames[0]);
    } else {
      goToPage("fastRound");
    }
  };

  const clickFinish = () => {
    goToPage("finish");
  };

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex max-h-screen flex-col items-center justify-center gap-4 bg-[#282c34] p-4 text-white">
        <GamesTable />
        <div className="flex gap-4">
          <Button onClick={startClick} className="bg-red-800 hover:bg-red-900">
            {page === "lobby" ? "Start" : "Go to Lobby"}
          </Button>
          <Button
            onClick={resetClick}
            className="bg-amber-700 hover:bg-amber-800"
          >
            reset
          </Button>
          {page !== "fastRound" && <Button onClick={nextClick}>Next</Button>}
          <Button
            onClick={pauseClick}
            variant="outline"
            className="border-blue-800 bg-transparent hover:bg-gray-800 hover:text-blue-50"
          >
            {paused ? "▶" : "▐▐"}
          </Button>
          <Button
            onClick={wrongClick}
            variant="outline"
            className="border-red-800 bg-transparent hover:bg-red-800 hover:text-blue-50"
          >
            ❌
          </Button>
          <Button
            onClick={correctClick}
            variant="outline"
            className="border-green-800 bg-transparent text-green-500 hover:bg-green-800 hover:text-blue-50"
          >
            ✔
          </Button>
          <Button
            onClick={timeClick}
            variant="outline"
            className="border-violet-700 bg-transparent text-violet-600 hover:bg-violet-800 hover:text-blue-50"
          >
            ⏱
          </Button>
          <Button
            onClick={clickFastRound}
            className="bg-emerald-800 hover:bg-emerald-900"
          >
            {page === "fastRound" ? "Start" : "Fast-Round"}
          </Button>
          <Button
            onClick={clickFinish}
            className="bg-violet-500 hover:bg-violet-600"
          >
            Finish
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {isFastRound && (
            <div className="grid auto-cols-auto grid-flow-col items-center gap-2">
              <div className="px-3">{fastRoundTurn}</div>
              <Button
                onClick={clickCorrectAnswer(fastRoundTurn)}
                variant="outline"
                className="h-auto border-gray-200 bg-transparent p-1 hover:bg-gray-600 hover:text-blue-50"
              >
                {`Correct + ${game.points}`}
              </Button>
              <Button
                onClick={clickWrongAnswer(fastRoundTurn)}
                variant="outline"
                className="h-auto border-red-800 bg-transparent p-1 hover:bg-red-900 hover:text-blue-50"
              >
                {`Wrong`}
              </Button>
              <ManualPoints team={fastRoundTurn} />
            </div>
          )}
          {game &&
            gameBuzzes.map((buzz, i) => (
              <div
                key={buzz}
                className="grid auto-cols-auto grid-flow-col items-center gap-2"
              >
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
                  onClick={clickCorrectAnswer(buzz)}
                  variant="outline"
                  className="h-auto border-gray-200 bg-transparent p-1 hover:bg-gray-600 hover:text-blue-50"
                >
                  {`Correct + ${game.points}`}
                </Button>
                <Button
                  onClick={clickWrongAnswer(buzz)}
                  variant="outline"
                  className="h-auto border-red-800 bg-transparent p-1 hover:bg-red-900 hover:text-blue-50"
                >
                  {`Wrong - ${Math.round(game.points / 2)}`}
                </Button>
                <ManualPoints team={buzz} />
              </div>
            ))}
          {otherTeams.map((team) => (
            <div
              key={team}
              className="grid auto-cols-auto grid-flow-col items-center gap-2"
            >
              <div className="px-3">{team}</div>
              <ManualPoints team={team} />
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default Admin;
