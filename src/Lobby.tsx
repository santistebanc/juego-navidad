import PartySocket from 'partysocket';
import { Team } from '../interfaces';
import { Button } from './components/ui/button';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface Props {
  teams: Team[];
  partySocket: PartySocket;
}

function Lobby({ teams, partySocket }: Props) {
  const [animationParent] = useAutoAnimate();

  const startClick = () => {
    partySocket.send(
      JSON.stringify({
        type: 'update',
        game: {
          id: 't1',
          data: {
            type: 'trivia',
            question:
              '¿Qué es un punto de alta densidad, que guarda comprimida toda la energía del universo?',
          },
        },
      }),
    );
  };

  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <p className="mb-8 bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-5xl font-black text-transparent selection:bg-transparent">
          Navidad 2023
        </p>
        <ul ref={animationParent}>
          {teams.map((team) => (
            <li className="text-lg" key={team.name}>
              {team.name}
            </li>
          ))}
        </ul>
        <Button
          onClick={startClick}
          className="mt-8 bg-red-800 hover:bg-red-900"
        >
          Empezar
        </Button>
      </header>
    </div>
  );
}

export default Lobby;
