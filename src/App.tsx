import Lobby from "./Lobby";
import Register from "./Register";
import UserLobby from "./UserLobby";
import TriviaQuestion from "./TriviaQuestion";
import TriviaUserQuestion from "./TriviaUserQuestion";
import { DataProvider, useData } from "./DataContext";
import Admin from "./Admin";
import { PropsWithChildren } from "react";
import TeamsList from "./TeamsList";
import ShowGameEffect from "./ShowGameEffect";
import GameBuzzes from "./GameBuzzes";
import MusicQuestion from "./MusicQuestion";

const Layout = ({ children }: PropsWithChildren<unknown>) => (
  <div className="relative grid min-h-screen auto-cols-max grid-flow-col items-center justify-center bg-[#282c34]">
    <div>
      <TeamsList />
    </div>
    <div>{children}</div>
    <GameBuzzes />
    <ShowGameEffect />
  </div>
);

const Board = () => {
  const { page, gamesList } = useData();
  if (page === "lobby")
    return (
      <Layout>
        <Lobby />
      </Layout>
    );
  if (gamesList[page]?.type === "trivia")
    return (
      <Layout>
        <TriviaQuestion />
      </Layout>
    );

  if (gamesList[page]?.type === "music")
    return (
      <Layout>
        <MusicQuestion />
      </Layout>
    );
};

const User = () => {
  const { players, id, page, gamesList } = useData();
  if (!players[id]) return <Register />;
  if (page === "lobby") return <UserLobby />;
  return <TriviaUserQuestion />;
};

const App = () => {
  const hash = window.location.hash;
  const component =
    hash === "#admin" ? <Admin /> : hash === "#board" ? <Board /> : <User />;

  return <DataProvider>{component}</DataProvider>;
};

export default App;
