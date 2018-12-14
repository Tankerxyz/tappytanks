import BABYLON, { Vector3 } from 'babylonjs';
import Player from './';

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
    this.players.push(new Player({...player, animatable: true}, this._scene));
  }

  public removePlayer(player: any): void {
    const playerToRemove = this.players.filter(({ id }) => id === player.id)[0];
    this.players.splice(this.players.indexOf(playerToRemove), 1);
    playerToRemove.model.dispose();
  }

  public changePlayerRotation(player: any): void {
    const playerToChange = this.players.filter(({ id }) => id === player.id)[0];
    playerToChange.setRotation(player.rotation);
  }

  public changePlayerPosition(player: any): void {
    const playerToChange = this.players.filter(({ id }) => id === player.id)[0];
    playerToChange.setPosition(player.position);
  }
}
