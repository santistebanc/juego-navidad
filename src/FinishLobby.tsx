import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

function FinishLobby() {
  const { width, height } = useWindowSize();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <p className="mb-8 bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-9xl font-black text-transparent selection:bg-transparent">
        <div>FIN</div>
      </p>
      <Confetti width={width} height={height} />
    </div>
  );
}

export default FinishLobby;
