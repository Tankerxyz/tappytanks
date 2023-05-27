import BABYLON, { Vector3 } from 'babylonjs';
import Player from './Player';
import MissileController from '../control/MissileController';
import Field from '../core/Field';

export default class PlayersController {
  private players: Array<Player> = [];
  private missileControllers: Array<MissileController> = [];
  private _scene: BABYLON.Scene;
  private _field: Field;

  constructor(players: Array<Player>, scene: BABYLON.Scene, field: Field) {
    this.players = players;
    this._scene = scene;
    this._field = field;
  }

  public getPlayers(): Array<Player> {
    return this.players;
  }

  public addPlayer(player: any): void {
    const newPlayer = new Player({...player, animatable: true, withGui: false}, this._scene);
    const missileCtrlForNewPlayer = new MissileController(this._scene, newPlayer, this._field,() => {}, true);

    this.players.push(newPlayer);
    this.missileControllers.push(missileCtrlForNewPlayer);
  }

  public removePlayer(player: any): void {
    const playerToRemove = this.players.filter(({ userID }) => userID === player.userID)[0];
    this.players.splice(this.players.indexOf(playerToRemove), 1);
    playerToRemove.dispose();
  }

  public shot(player: any): void {
    const missileCtrlToShoot = this.missileControllers.filter(({ _player: { userID} }) => userID === player.userID)[0];
    missileCtrlToShoot.shootMissile();
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

  public update(): void {
    this.missileControllers.forEach((ctrl) => {
      ctrl.update();
    });
  }
}
