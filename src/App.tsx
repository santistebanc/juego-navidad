import Lobby from "./Lobby";
import Register from "./Register";
import UserLobby from "./UserLobby";
import TriviaQuestion from "./TriviaQuestion";
import TriviaUserQuestion from "./TriviaUserQuestion";
import { DataProvider, useData } from "./DataContext";
import { games } from "../games";
import Admin from "./Admin";
import { PropsWithChildren } from "react";
import TeamsList from "./TeamsList";

const Layout = ({ children }: PropsWithChildren<unknown>) => (
  <div className="grid min-h-screen auto-cols-max grid-flow-col bg-[#282c34]">
    <div>
      <TeamsList />
    </div>
    <div>{children}</div>
  </div>
);

const Board = () => {
  const { page } = useData();
  if (page === "lobby")
    return (
      <Layout>
        <Lobby />
      </Layout>
    );
  if (games[page].type === "trivia")
    return (
      <Layout>
        <TriviaQuestion />
      </Layout>
    );
};

const User = () => {
  const { players, id, page } = useData();
  if (!players[id]) return <Register />;
  if (page === "lobby") return <UserLobby />;
  if (games[page].type === "trivia") return <TriviaUserQuestion />;
};

const App = () => {
  const hash = window.location.hash;
  const component =
    hash === "#admin" ? <Admin /> : hash === "#board" ? <Board /> : <User />;

  return <DataProvider>{component}</DataProvider>;
};

export default App;
