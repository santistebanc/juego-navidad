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
import FastRound from "./FastRound";
import UserFastRound from "./UserFastRound";
import FastRoundLobby from "./FastRoundLobby";
import FinishLobby from "./FinishLobby";

const Layout = ({ children }: PropsWithChildren<unknown>) => (
  <div className="relative flex min-h-screen items-center justify-center bg-[#282c34]">
    <div className="flex min-h-screen flex-col p-10">
      <TeamsList />
    </div>
    <div className="flex-1">{children}</div>
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

  if (page === "fastRound")
    return (
      <Layout>
        <FastRoundLobby />
      </Layout>
    );

  if (page === "finish")
    return (
      <Layout>
        <FinishLobby />
      </Layout>
    );

  // if (gamesList[page]?.type === "flash") {
  //   return (
  //     <Layout>
  //       <FastRound />
  //     </Layout>
  //   );
  // }

  if (gamesList[page]?.type === "trivia" || gamesList[page]?.type === "flash")
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
  if (page === "lobby" || page === "fastRound" || page === "finish")
    return <UserLobby />;
  // if (gamesList[page]?.type === "flash") return <UserFastRound />;
  return <TriviaUserQuestion />;
};

const App = () => {
  const hash = window.location.hash;
  const component =
    hash === "#admin" ? <Admin /> : hash === "#board" ? <Board /> : <User />;

  return <DataProvider>{component}</DataProvider>;
};

export default App;
