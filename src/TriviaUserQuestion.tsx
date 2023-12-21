import PartySocket from 'partysocket';
import BuzzerButton from './BuzzerButton';

interface Props {
  id: string;
  partySocket: PartySocket;
}

function TriviaUserQuestion({ id, partySocket }: Props) {
  const handleClick = () => {
    partySocket.send(JSON.stringify({ type: 'buzz', id }));
}
  return (
    <div className="text-center selection:bg-green-900">
      <header className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white">
        <BuzzerButton onClick={handleClick} />
      </header>
    </div>
  );
}

export default TriviaUserQuestion;
