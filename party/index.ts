import type * as Party from 'partykit/server';
import { Game, Message, Team } from '../interfaces';

export default class WebSocketServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  teams: Team[] = [];
  game?: Game;
  buzzes: string[] = [];

  onMessage(message: string) {
    const data = JSON.parse(message) as Message;
    if (data.type === 'buzz') {
      if (this.game?.data.type === 'trivia') {
        if (!this.buzzes.includes(data.id)) this.buzzes.push(data.id);
      }
    } else if (data.type === 'update') {
      if (data.teams) this.teams = data.teams;
      if (data.game === null) {
        this.buzzes = [];
        this.game = undefined;
      }
      if (data.game) {
        this.buzzes = [];
        this.game = data.game;
      }
    }
    this.party.broadcast(
      JSON.stringify({
        type: 'update',
        teams: this.teams,
        game: this.game,
        buzzes: this.buzzes,
      }),
    );
  }
  onConnect(connection: Party.Connection) {
    connection.send(JSON.stringify({ type: 'connect', id: connection.id }));
    this.update();
  }

  onClose(connection: Party.Connection) {
    const team = this.teams.find((team) =>
      team.players.includes(connection.id),
    );

    if (team) {
      const idx = team.players.indexOf(connection.id);
      if (idx !== -1) {
        team.players.splice(idx, 1);
      }
      if (team.players.length === 0) {
        this.teams.splice(this.teams.indexOf(team), 1);
      }
    }
    this.update();
  }

  update() {
    this.party.broadcast(
      JSON.stringify({
        type: 'update',
        teams: this.teams,
        game: this.game,
      }),
    );
  }
}
