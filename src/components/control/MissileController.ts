import * as BABYLON from 'babylonjs';
import keycode from 'keycode';

import { Direction } from '../types/direction';
import Missile from '../models/Missile';
import Player from '../player/Player';
import Field from '../core/Field';

export default class MissileController {
  private _scene: BABYLON.Scene;
  private _missiles: Missile[] = [];
  private _missileSpeed = 2; // Adjust the speed as needed
  public _player: Player;
  private _field: Field;
  private _timestampToRender: number = 1000;

  /**
   * Constructs a MissileController instance.
   * @param scene - The Babylon.js scene.
   * @param player - The player object.
   * @param field
   * @param onMainPlayerShot
   * @param withoutControls - Whether to initialize key handlers for shooting missiles.
   * @param timestampToRender - The timestamp to render for missiles.
   */
  constructor(
    scene: BABYLON.Scene,
    player: Player,
    field: Field,
    onMainPlayerShot: () => void = () => {},
    withoutControls: boolean = false,
    timestampToRender: number = 1000
  ) {
    this._scene = scene;
    this._player = player;
    // todo: for collision checking
    this._field = field;
    this._timestampToRender = timestampToRender;

    if (!withoutControls) {
      this.initKeyHandler(onMainPlayerShot);
    }
  }

  /**
   * Initializes the key handler to shoot missiles when the space key is pressed.
   */
  private initKeyHandler(onMainPlayerShot: () => void): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.keyCode === keycode('space')) {

        // if called from here it means main player, p.s. todo refactor by moving into global key handler
        onMainPlayerShot();

        this.shootMissile();
      }
    });
  }

  private getMissileDirection(): Direction {
    const modelRotation = this._player.rotation;

    const rotationY = modelRotation.y; // Get the Y-component of the model's rotation

    const sinY = ~~Math.sin(rotationY);
    const cosY = ~~Math.cos(rotationY);

    let direction: Direction;

    if (sinY === 0) {
      direction = cosY === 1 ? Direction.Forward : Direction.Backward;
    } else {
      direction = sinY === 1 ? Direction.Right : Direction.Left;
    }

    return direction;
  }

  /**
   * Shoots a missile from the specified position with the given direction.
   */
  public shootMissile(): void {
    const missileDirection = this.getMissileDirection();

    const missile = new Missile(
      this._player.position,
      this._player.rotation,
      missileDirection,
      this._missileSpeed,
      this._timestampToRender
    );

    this._missiles.push(missile);
    missile.addToScene(this._scene);
  }

  /**
   * Updates the missiles' positions and removes any missiles that are out of bounds.
   */
  public update(): void {
    const missilesToRemove: Missile[] = [];

    this._missiles.forEach((missile) => {
      missile.move();

      // is collision then destroy collision
      if (!MissileController.isWithinBounds(missile.position)) {
        missilesToRemove.push(missile);
      }
    });

    missilesToRemove.forEach((missile) => {
      const index = this._missiles.indexOf(missile);
      if (index !== -1) {
        this._missiles.splice(index, 1);
        missile.dispose();
      }
    });
  }

  /**
   * Checks if the given position is within the bounds of the scene.
   * @param position - The position to check.
   * @returns True if the position is within bounds, false otherwise.
   */
  static isWithinBounds(position: BABYLON.Vector3): boolean {
    // Adjust the scene bounds as needed
    const minX = -10;
    const maxX = 10;
    const minZ = -10;
    const maxZ = 10;

    // TODO: Add proper collision checks from field

    return (
      position.x >= minX &&
      position.x <= maxX &&
      position.z >= minZ &&
      position.z <= maxZ
    );
  }
}
