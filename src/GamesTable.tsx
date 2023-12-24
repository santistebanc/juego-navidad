import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "./DataContext";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

function GamesTable() {
  const { games, buzzes, page, goToPage, gamesList, resetGame } = useData();
  const list = games.map((id) => ({ id, ...gamesList[id] }));

  const fastRoundGames = list.filter((g) => g.type === "flash");
  const normalGames = list.filter((g) => g.type !== "flash");

  const handleClickGo = (id: string) => () => {
    goToPage(id);
  };

  const resetClick = (id: string) => () => {
    resetGame(id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>id</TableHead>
          <TableHead>type</TableHead>
          <TableHead>question</TableHead>
          <TableHead>answer</TableHead>
          <TableHead>points</TableHead>
          <TableHead>buzzes</TableHead>
          <TableHead className="text-right">actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...normalGames, ...fastRoundGames].map(
          ({ id, question, answer, type, points }) => (
            <TableRow
              key={id}
              className={cn("hover:bg-slate-700", {
                "bg-teal-900 hover:bg-teal-800": page === id,
              })}
            >
              <TableCell className="font-medium">{id}</TableCell>
              <TableCell>{type}</TableCell>
              <TableCell>{question}</TableCell>
              <TableCell>{answer}</TableCell>
              <TableCell className="font-medium">{points}</TableCell>
              <TableCell className="flex gap-2 font-medium">
                {buzzes[id]?.map((buzz) => (
                  <Badge
                    variant="outline"
                    key={buzz}
                    className="border-blue-500 text-blue-400"
                  >
                    {buzz}
                  </Badge>
                ))}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 text-right">
                  <Button onClick={handleClickGo(id)}>go</Button>
                  <Button
                    onClick={resetClick(id)}
                    className="bg-amber-700 hover:bg-amber-800"
                  >
                    reset
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}

export default GamesTable;
