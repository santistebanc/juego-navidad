import { useState } from 'react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import PartySocket from 'partysocket';
import { Team } from 'interfaces';

interface Props {
  id?: string;
  partySocket: PartySocket;
  teams: Team[];
}

function Register({ id, partySocket, teams }: Props) {
  const [teamName, setTeamName] = useState(
    localStorage.getItem('navidad2023Team') ?? '',
  );

  const onChangeTeamInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTeamName(text);
    localStorage.setItem('navidad2023Team', text);
  };

  const submitTeam = () => {
    const myTeam = teams.find((team) => team.name === teamName);
    const newTeams = [...teams];
    if (id && !myTeam) {
      newTeams.push({ name: teamName, points: 0, players: [id] });
      console.log('here', newTeams);
      partySocket.send(JSON.stringify({ type: 'update', teams: newTeams }));
    } else if (id && myTeam && !myTeam.players.includes(id)) {
      newTeams[newTeams.indexOf(myTeam)].players.push(id);
      partySocket.send(JSON.stringify({ type: 'update', teams: newTeams }));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#282c34]">
      <p className="bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-5xl font-black text-transparent selection:bg-transparent">
        Navidad 2023
      </p>
      <div className="mt-8 flex">
        <Input value={teamName} onChange={onChangeTeamInput} />
        <Button onClick={submitTeam}>Ok</Button>
      </div>
    </div>
  );
}

export default Register;
