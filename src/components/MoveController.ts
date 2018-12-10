import Field from './Field';
import Controls from './Controls';
import * as BABYLON from "babylonjs";
import Player from './Player';

export default class MoveController {
  private _field: Field;
  private _movableObject: BABYLON.Mesh;
  private _controls: Controls;

  constructor(scene: BABYLON.Scene, field: Field, player: Player, camera: any, io: any) {
    this._movableObject = player.model;
    this._field = field;

    this._controls = new Controls(scene, this._movableObject, camera, this.collisionNormalizer, io);
  }

  collisionNormalizer = (position: BABYLON.Vector3, prevPosition: BABYLON.Vector3): BABYLON.Vector3 => {
    const halfWidth = this._field.width / 2;
    if (position.x > halfWidth || position.x < -halfWidth) {
      position.x = prevPosition.x;
      return position;
    }

    const halfHeight = this._field.height / 2;
    if (position.z > halfHeight || position.z < -halfHeight) {
      position.z = prevPosition.z;
      return position;
    }

    const impactedWalls = this._field.getWallsByPosition(position);
    if (impactedWalls.length) {
      position.z = prevPosition.z;
      position.x = prevPosition.x;
      return position;
    }

    const impactedModels = this._field.getPlayerModelByPosition(position);
    if (impactedModels.length) {
      position.z = prevPosition.z;
      position.x = prevPosition.x;
      return position;
    }

    return position;
  }
}
