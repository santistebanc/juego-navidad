export interface Team {
  name: string;
  points: number;
  players: string[]
}

export type Message = UpdateMessage | ConnectionMessage

export interface UpdateMessage {
  type: 'update';
  teams: Team[]
}

export interface ConnectionMessage {
  type: 'connect';
  id: string;
}