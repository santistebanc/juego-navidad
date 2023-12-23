import { useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useData } from "./DataContext";

interface Props {
  team: string;
}

function ManualPoints({ team }: Props) {
  const { givePoints } = useData();

  const [pointsAmount, setPointsAmount] = useState(0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setPointsAmount(Number(text));
    localStorage.setItem("navidad2023Team", text);
  };

  const submitPoints = () => {
    givePoints(team, pointsAmount);
  };

  return (
    <div className="flex items-center">
      <Input
        className="z-10 h-fit w-12 rounded-none border-2 border-r-0 border-slate-500 bg-slate-800 p-1 px-2 text-right text-white focus:outline-none"
        type="number"
        value={pointsAmount}
        onChange={onChange}
      />
      <Button
        size="sm"
        className="h-fit rounded-none border-2 border-l-0 border-slate-500 bg-slate-600 p-1 px-2 hover:bg-slate-700"
        onClick={submitPoints}
      >
        give points
      </Button>
    </div>
  );
}

export default ManualPoints;
