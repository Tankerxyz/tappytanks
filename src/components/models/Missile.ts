import * as BABYLON from 'babylonjs';
import { normalizeNewPositionFromRotationY } from '../../utils';
import { Direction } from '../types/direction';

export default class Missile {
  private _mesh: BABYLON.Mesh;
  private _direction: Direction;
  private _speed: number;
  private _startTime: Date;
  private _timestampToRender: number;

  /**
   * Constructs a Missile instance.
   * @param position - The initial position of the missile.
   * @param rotation - The rotation of the missile.
   * @param direction - The direction of the missile.
   * @param speed - The speed of the missile.
   * @param timestampToRender - The timestamp to render for the missile.
   */
  constructor(
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3,
    direction: Direction,
    speed: number,
    timestampToRender: number = 1000
  ) {
    this._mesh = BABYLON.MeshBuilder.CreateBox('missile', { size: 1 });
    this._direction = direction;
    this._speed = speed;
    this._timestampToRender = timestampToRender;
    this._startTime = new Date();

    this.init(position, rotation);
  }

  /**
   * Adds the missile to the specified scene.
   * @param scene - The scene to add the missile to.
   */
  addToScene(scene: BABYLON.Scene): void {
    scene.addMesh(this._mesh);
  }

  /**
   * Initializes the missile's position based on the given position and rotation.
   * @param position - The initial position of the missile.
   * @param rotation - The rotation of the missile.
   */
  init(position: BABYLON.Vector3, rotation: BABYLON.Vector3): void {
    const { x, y, z } = position;
    const { newX, newZ } = normalizeNewPositionFromRotationY(rotation.y);

    const startPosition = new BABYLON.Vector3(Math.round(x + -1 * newX), y, Math.round(z + -1 * newZ));

    this._mesh.position = startPosition;
  }

  /**
   * Calculates the next position of the missile based on its direction and speed.
   * @returns The next position of the missile.
   */
  getNextPosition(): BABYLON.Vector3 {
    switch (this._direction) {
      case Direction.Forward:
        return new BABYLON.Vector3(0, 0, -this._speed);
      case Direction.Backward:
        return new BABYLON.Vector3(0, 0, this._speed);
      case Direction.Right:
        return new BABYLON.Vector3(-this._speed, 0, 0);
      case Direction.Left:
        return new BABYLON.Vector3(this._speed, 0, 0);
      default:
        throw new Error('Invalid direction');
    }
  }

  /**
   * Moves the missile based on its direction and speed.
   */
  move(): void {
    const currentTime = new Date();
    const elapsedTime = currentTime.getTime() - this._startTime.getTime();

    if (elapsedTime >= this._timestampToRender) {
      const newPosition = this.getNextPosition();

      this._mesh.position.addInPlace(newPosition);

      // Reset the start time for the next iteration
      this._startTime = currentTime;
    }
  }

  /**
   * Disposes of the missile mesh.
   */
  dispose(): void {
    this._mesh.dispose();
  }

  /**
   * Gets the position of the missile.
   * @returns The position of the missile.
   */
  get position(): BABYLON.Vector3 {
    return this._mesh.position.clone();
  }
}
