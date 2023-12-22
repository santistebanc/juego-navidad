import { AppProps, ClientMessage } from "interfaces";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PartySocket from "partysocket";

// connect to our server
const partySocket = new PartySocket({
  host:
    window.location.hostname === "localhost"
      ? "localhost:1999"
      : "https://juego-navidad.santistebanc.partykit.dev",
  room: "my-room",
});

const send = (message: ClientMessage) => {
  partySocket.send(JSON.stringify(message));
};

const assignTeam = (playerId: string, teamName: string) => {
  send({ action: "assignTeam", playerId, teamName });
};

const buzz = (playerId: string, gameId: string) => {
  send({ action: "buzz", playerId, gameId });
};

const goToPage = (page: string) => {
  send({ action: "goToPage", page });
};

const togglePause = (state?: boolean) => {
  send({ action: "togglePause", state });
};

const clearBuzzes = (gameId: string) => {
  send({ action: "clearBuzzes", gameId });
};

const givePoints = (team: string, points: number) => {
  send({ action: "givePoints", team, points });
};

interface DataContextProps extends AppProps {
  id: string;
  team: string;
  teams: string[];
  gameBuzzes: string[];
  assignTeam: typeof assignTeam;
  buzz: typeof buzz;
  goToPage: typeof goToPage;
  togglePause: typeof togglePause;
  clearBuzzes: typeof clearBuzzes;
  givePoints: typeof givePoints;
}

const DataContext = createContext<DataContextProps>(null);

export const DataProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [players, setPlayers] = useState<DataContextProps["players"]>({});
  const [games, setGames] = useState<DataContextProps["games"]>([]);
  const [buzzes, setBuzzes] = useState<DataContextProps["buzzes"]>({});
  const [points, setPoints] = useState<DataContextProps["points"]>({});
  const [page, setPage] = useState<DataContextProps["page"]>("lobby");
  const [paused, setPaused] = useState<DataContextProps["paused"]>(false);

  useEffect(() => {
    const listener = (e: MessageEvent) => {
      const message: AppProps = JSON.parse(e.data);
      setPlayers(message.players);
      setGames(message.games);
      setBuzzes(message.buzzes);
      setPoints(message.points);
      setPage(message.page);
      setPaused(message.paused);
    };

    partySocket.addEventListener("message", listener);

    return () => {
      partySocket.removeEventListener("message", listener);
    };
  }, []);

  const team = useMemo(() => players[partySocket.id], [players]);
  const teams = useMemo(() => [...new Set(Object.values(players))], [players]);
  const gameBuzzes = useMemo(() => buzzes[page] ?? [], [buzzes, page]);

  const pointsPerTeam = useMemo(
    () => Object.fromEntries(teams.map((team) => [team, points[team] ?? 0])),
    [teams, points]
  );

  return (
    <DataContext.Provider
      value={{
        id: partySocket.id,
        team,
        teams,
        players,
        games,
        buzzes,
        gameBuzzes,
        points: pointsPerTeam,
        page,
        paused,
        assignTeam,
        buzz,
        togglePause,
        goToPage,
        clearBuzzes,
        givePoints,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const data = useContext(DataContext);
  return data;
};
