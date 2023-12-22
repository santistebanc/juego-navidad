import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { games as gamesList } from "../games";
import { useData } from "./DataContext";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";

function GamesTable() {
  const { games, buzzes, page, goToPage } = useData();
  const list = games.map((id) => ({ id, ...gamesList[id] }));

  const handleClickGo = (id: string) => () => {
    goToPage(id);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
        {list.map(({ id, question, answer, type, points }) => (
          <TableRow key={id} className={cn({ "bg-teal-900": page === id })}>
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
            <TableCell className="text-right">
              <Button onClick={handleClickGo(id)}>go</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default GamesTable;
