import type * as Party from "partykit/server";
import { ClientMessage, GameEffect } from "../interfaces";
import { localQuestions, resouceURL } from "../constants";

export default class WebSocketServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  players: Record<string, string> = {};
  games: string[];
  buzzes: Record<string, string[]> = {};
  points: Record<string, number> = {};
  page: "lobby" | "fastRound" | "finish" | string = "lobby";
  paused: boolean = false;
  gameEffect: GameEffect = "none";
  answers: Record<string, Record<string, number>> = {};
  fastRoundTurn: string;

  onStart() {
    fetch(resouceURL("games", ".json"))
      .then((res) => res.json())
      .then((obj) => {
        this.games = Object.keys({ ...obj, ...localQuestions });
        this.games.sort((a, b) => 0.5 - Math.random());
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
      this.fastRoundTurn = data.teamName;
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
    } else if (data.action === "triggerEffect") {
      this.gameEffect = data.effectName;
    } else if (data.action === "giveAnswer") {
      this.paused = true;
      this.gameEffect = data.answer === 1 ? "correct" : "wrong";
      if (!this.points[data.team]) {
        this.points[data.team] = 0;
      }
      this.points[data.team] += data.points;
      if (!this.answers[data.gameId]) {
        this.answers[data.gameId] = { [data.team]: data.answer };
      } else {
        this.answers[data.gameId][data.team] = data.answer;
      }
    } else if (data.action === "resetGame") {
      delete this.answers[data.gameId];
      delete this.buzzes[data.gameId];
      this.party.broadcast("reset");
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
      gameEffect: this.gameEffect,
      answers: this.answers,
      fastRoundTurn: this.fastRoundTurn,
    });

    this.party.broadcast(
      JSON.stringify({
        players: this.players,
        games: this.games,
        buzzes: this.buzzes,
        points: this.points,
        page: this.page,
        paused: this.paused,
        gameEffect: this.gameEffect,
        answers: this.answers,
        fastRoundTurn: this.fastRoundTurn,
      })
    );
  }
}
