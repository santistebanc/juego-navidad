export interface Team {
  name: string;
  points: number;
  players: string[];
}

export type Message = UpdateMessage | ConnectionMessage | Buzz;

export interface UpdateMessage {
  type: 'update';
  teams: Team[];
  game?: Game;
  buzzes?: string[];
}

export interface ConnectionMessage {
  type: 'connect';
  id: string;
}

export interface Buzz {
  type: 'buzz';
  id: string;
}

export interface Trivia {
  type: 'trivia';
  question: string;
  points: 100;
}

export interface Game {
  id: string;
  data: Trivia;
}
