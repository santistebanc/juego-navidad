import Snowfall from "react-snowfall";
import qr from "./assets/images/qr-code.png";

function Lobby() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#282c34] text-center text-white">
      <p className="mb-8 bg-gradient-to-r from-emerald-300 to-sky-300 bg-clip-text text-9xl font-black text-transparent selection:bg-transparent">
        Navidad 2023
      </p>
      <img src={qr} style={{ width: "30dvmin", height: "30dvmin" }} />
      <Snowfall />
    </div>
  );
}

export default Lobby;
