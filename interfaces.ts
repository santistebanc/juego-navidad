export interface AppProps {
  players: Record<string, string>;
  games: string[];
  buzzes: Record<string, string[]>;
  points: Record<string, number>;
  page: "lobby" | string;
  paused: boolean;
  gameEffect: GameEffect;
  answers: Record<string, Record<string, number>>;
  reset: boolean;
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
    }
  | {
      action: "triggerEffect";
      effectName: GameEffect;
    }
  | {
      action: "giveAnswer";
      gameId: string;
      team: string;
      answer: number;
      points: number;
    }
  | {
      action: "resetGame";
      gameId: string;
    };

export type GameEffect = "none" | "correct" | "wrong" | "timer";
