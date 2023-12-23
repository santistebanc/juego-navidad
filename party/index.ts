import type * as Party from "partykit/server";
import { ClientMessage } from "../interfaces";
import { s3host } from "../constants";

export default class WebSocketServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  players: Record<string, string> = {};
  games: string[];
  buzzes: Record<string, string[]> = {};
  points: Record<string, number> = {};
  page: "lobby" | string = "lobby";
  paused: boolean = false;

  onStart() {
    fetch(s3host + "games.json")
      .then((res) => res.json())
      .then((obj) => {
        this.games = Object.keys(obj);
      });
  }

  onMessage(message: string) {
    const data = JSON.parse(message) as ClientMessage;
    if (data.action === "buzz") {
      const team = this.players[data.playerId];
      if (!this.buzzes[data.gameId]) {
        this.paused = true;
        this.buzzes[data.gameId] = [team];
      } else if (!this.buzzes[data.gameId].includes(team)) {
        this.buzzes[data.gameId].push(team);
      }
    } else if (data.action === "assignTeam") {
      this.players[data.playerId] = data.teamName;
    } else if (data.action === "goToPage") {
      this.page = data.page;
    } else if (data.action === "togglePause") {
      this.paused = data.state !== undefined ? data.state : !this.paused;
    } else if (data.action === "clearBuzzes") {
      delete this.buzzes[data.gameId];
    } else if (data.action === "givePoints") {
      if (!this.points[data.team]) {
        this.points[data.team] = 0;
      }
      this.points[data.team] += data.points;
    }
    this.update();
  }

  onConnect(connection: Party.Connection) {
    this.update();
  }

  onClose(connection: Party.Connection) {
    delete this.players[connection.id];
    this.update();
  }

  update() {
    console.log({
      players: this.players,
      games: this.games,
      buzzes: this.buzzes,
      points: this.points,
      page: this.page,
      paused: this.paused,
    });

    this.party.broadcast(
      JSON.stringify({
        players: this.players,
        games: this.games,
        buzzes: this.buzzes,
        points: this.points,
        page: this.page,
        paused: this.paused,
      })
    );
  }
}
