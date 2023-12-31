import { AppProps, ClientMessage, GameEffect } from "interfaces";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PartySocket from "partysocket";
import Loading from "./Loading";
import { localQuestions, resouceURL } from "../constants";

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

const triggerEffect = (effectName: GameEffect) => {
  send({ action: "triggerEffect", effectName });
};

const fastRoundNext = () => {
  send({ action: "fastRoundNext" });
};

const giveAnswer = (
  gameId: string,
  team: string,
  answer: number,
  points: number
) => {
  send({ action: "giveAnswer", gameId, team, answer, points });
};

const resetGame = (gameId: string) => {
  send({ action: "resetGame", gameId });
};

interface DataContextProps extends AppProps {
  id: string;
  gamesList: Object;
  team: string;
  teams: string[];
  gameBuzzes: string[];
  reset: boolean;
  assignTeam: typeof assignTeam;
  buzz: typeof buzz;
  goToPage: typeof goToPage;
  togglePause: typeof togglePause;
  clearBuzzes: typeof clearBuzzes;
  givePoints: typeof givePoints;
  triggerEffect: typeof triggerEffect;
  giveAnswer: typeof giveAnswer;
  resetGame: typeof resetGame;
  fastRoundNext: typeof fastRoundNext;
}

const DataContext = createContext<DataContextProps>(null);

export const DataProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [loading, setLoading] = useState(true);
  const [gamesList, setGamesList] = useState();
  const [players, setPlayers] = useState<DataContextProps["players"]>({});
  const [games, setGames] = useState<DataContextProps["games"]>([]);
  const [buzzes, setBuzzes] = useState<DataContextProps["buzzes"]>({});
  const [points, setPoints] = useState<DataContextProps["points"]>({});
  const [page, setPage] = useState<DataContextProps["page"]>("lobby");
  const [paused, setPaused] = useState<DataContextProps["paused"]>(false);
  const [reset, setReset] = useState<DataContextProps["reset"]>(false);
  const [answers, setAnswers] = useState<DataContextProps["answers"]>({});
  const [gameEffect, setGameEffect] =
    useState<DataContextProps["gameEffect"]>("none");
  const [fastRoundTurn, setFastRoundTurn] =
    useState<DataContextProps["fastRoundTurn"]>();

  useEffect(() => {
    fetch(resouceURL("games", ".json"))
      .then((res) => res.json())
      .then((obj) => setGamesList({ ...obj, ...localQuestions }));

    const listener = (e: MessageEvent) => {
      if (e.data === "reset") {
        setReset(true);
        setTimeout(() => {
          setReset(false);
        }, 0);
      } else {
        const message: AppProps = JSON.parse(e.data);
        setPlayers(message.players);
        setGames(message.games);
        setBuzzes(message.buzzes);
        setPoints(message.points);
        setPage(message.page);
        setPaused(message.paused);
        setGameEffect(message.gameEffect);
        setAnswers(message.answers);
        setFastRoundTurn(message.fastRoundTurn);
        setLoading(false);
      }
    };

    partySocket.addEventListener("message", listener);

    return () => {
      partySocket.removeEventListener("message", listener);
    };
  }, []);

  const team = useMemo(() => players[partySocket.id], [players]);
  const teams = useMemo(() => {
    const l = [...new Set(Object.values(players))];
    l.sort((a, b) => points[b] - points[a]);
    return l;
  }, [players, points]);
  const gameBuzzes = useMemo(() => buzzes[page] ?? [], [buzzes, page]);

  const pointsPerTeam = useMemo(
    () => Object.fromEntries(teams.map((team) => [team, points[team] ?? 0])),
    [teams, points]
  );

  if (loading || !gamesList) return <Loading />;

  return (
    <DataContext.Provider
      value={{
        id: partySocket.id,
        gamesList,
        team,
        teams,
        players,
        games,
        buzzes,
        gameBuzzes,
        points: pointsPerTeam,
        page,
        paused,
        reset,
        gameEffect,
        answers,
        fastRoundTurn,
        assignTeam,
        buzz,
        togglePause,
        goToPage,
        clearBuzzes,
        givePoints,
        triggerEffect,
        giveAnswer,
        resetGame,
        fastRoundNext,
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
