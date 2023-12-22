export interface AppProps {
  players: Record<string, string>;
  games: string[];
  buzzes: Record<string, string[]>;
  points: Record<string, number>;
  page: "lobby" | string;
  paused: boolean;
}

export type ClientMessage =
  | {
      action: "assignTeam";
      playerId: string;
      teamName: string;
    }
  | {
      action: "buzz";
      playerId: string;
      gameId: string;
    }
  | {
      action: "goToPage";
      page: string;
    }
  | {
      action: "togglePause";
      state?: boolean;
    }
  | {
      action: "clearBuzzes";
      gameId: string;
    }
  | {
      action: "givePoints";
      team: string;
      points: number;
    };
