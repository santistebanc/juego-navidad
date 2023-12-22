import PartySocket from "partysocket";
import BuzzerButton from "./BuzzerButton";
import { cn } from "./lib/utils";

interface Props {
  id: string;
  partySocket: PartySocket;
  buzzStatus: "idle" | "first" | "late";
}

function TriviaUserQuestion({ id, partySocket, buzzStatus }: Props) {
  console.log("///////////////buzzStatus", buzzStatus);

  const handleClick = () => {
    partySocket.send(JSON.stringify({ type: "buzz", id }));
  };
  return (
    <div className="text-center">
      <header
        className={cn(
          "flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-white",
          {
            "bg-yellow-500": buzzStatus === "first",
            "bg-red-800": buzzStatus === "late",
          }
        )}
      >
        <BuzzerButton onClick={handleClick} />
      </header>
    </div>
  );
}

export default TriviaUserQuestion;
