import BABYLON, { Vector3 } from 'babylonjs';
import Player from './Player';

export default class PlayersController {
  private players: Array<Player> = [];
  private _scene: BABYLON.Scene;

  constructor(players: Array<Player>, scene: BABYLON.Scene) {
    this.players = players;
    this._scene = scene;
  }

  public getPlayers(): Array<Player> {
    return this.players;
  }

  public addPlayer(player: any): void {
    this.players.push(new Player({...player, animatable: true, withGui: false}, this._scene));
  }

  public removePlayer(player: any): void {
    const playerToRemove = this.players.filter(({ userID }) => userID === player.userID)[0];
    this.players.splice(this.players.indexOf(playerToRemove), 1);
    playerToRemove.dispose();
  }

  public changePlayerRotation(player: any): void {
    const playerToChange = this.players.filter(({ userID }) => userID === player.userID)[0];
    playerToChange.setRotation(player.rotation);
  }

  public changePlayerPosition(player: any): void {
    const playerToChange = this.players.filter(({ userID }) => userID === player.userID)[0];
    playerToChange.setPosition(player.position);
  }

  public removeAll(): void {
    this.players.forEach((p) => this.removePlayer(p));
  }
}
