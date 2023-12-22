import Lobby from "./Lobby";
import PartySocket from "partysocket";
import { Game, Message, Team } from "../interfaces";
import { useEffect, useState } from "react";
import Register from "./Register";
import UserLobby from "./UserLobby";
import TriviaQuestion from "./TriviaQuestion";
import Loading from "./Loading";
import TriviaUserQuestion from "./TriviaUserQuestion";

// connect to our server
const partySocket = new PartySocket({
  host: "https://juego-navidad.santistebanc.partykit.dev",
  room: "my-room",
});

const App = () => {
  const [id, setId] = useState<string>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [game, setGame] = useState<Game>();
  const [buzzes, setBuzzes] = useState<string[]>([]);
  useEffect(() => {
    const listener = (e: MessageEvent) => {
      const message: Message = JSON.parse(e.data);
      if (message.type === "connect") {
        setId(message.id);
      } else if (message.type === "update") {
        setTeams(message.teams);
        setGame(message.game);
        if (message.buzzes) setBuzzes(message.buzzes);
      }
      console.log(message);
    };

    partySocket.addEventListener("message", listener);

    return () => {
      partySocket.removeEventListener("message", listener);
    };
  }, []);

  const team = id && teams.find((team) => team.players.includes(id));

  const hash = window.location.hash;

  const buzzTeams = [
    ...new Set(
      buzzes.flatMap((tid) => {
        const t = teams.find((t) => t.players.includes(tid));
        return t ? [t] : [];
      })
    ),
  ];

  console.log({ buzzes, buzzTeams });

  if (!id) return <Loading />;

  if (hash === "#board") {
    if (!game) return <Lobby partySocket={partySocket} teams={teams} />;
    if (game.data.type === "trivia")
      return (
        <TriviaQuestion
          data={game.data}
          partySocket={partySocket}
          buzzes={buzzTeams}
        />
      );
  }

  if (!team)
    return <Register id={id} teams={teams} partySocket={partySocket} />;

  if (!game) return <UserLobby id={id} teams={teams} />;

  if (game.data.type === "trivia")
    return (
      <TriviaUserQuestion
        id={id}
        partySocket={partySocket}
        buzzStatus={
          buzzTeams[0] === team
            ? "first"
            : buzzTeams.includes(team)
            ? "late"
            : "idle"
        }
      />
    );
};

export default App;
