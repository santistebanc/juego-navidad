import Lobby from './Lobby';
import PartySocket from 'partysocket';
import { Message, Team } from '../interfaces';
import { useEffect, useState } from 'react';
import Register from './Register';

// connect to our server
const partySocket = new PartySocket({
  host: 'https://juego-navidad.santistebanc.partykit.dev',
  room: 'my-room',
});

const App = () => {
  const [id, setId] = useState<string>();
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    const listener = (e: MessageEvent) => {
      const message: Message = JSON.parse(e.data);
      if (message.type === 'connect') {
        setId(message.id);
      } else {
        setTeams(message.teams);
      }
      console.log(message);
    };

    partySocket.addEventListener('message', listener);

    return () => {
      partySocket.removeEventListener('message', listener);
    };
  }, []);

  const team = id && teams.find((team) => team.players.includes(id));

  if (!team)
    return <Register id={id} teams={teams} partySocket={partySocket} />;

  return <Lobby id={id} teams={teams} />;
};

export default App;
