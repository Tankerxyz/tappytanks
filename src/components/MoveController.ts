import Field from './Field';
import Controls from './Controls';
import * as BABYLON from "babylonjs";

export default class MoveController {
  private _field: Field;
  private _movableObject: BABYLON.Mesh;
  private _controls: Controls;

  constructor(scene: BABYLON.Scene, field: Field, movableObject: BABYLON.Mesh, camera: any) {
    this._movableObject = movableObject;
    this._field = field;

    this._controls = new Controls(scene, movableObject, camera, this.collisionNormalizer);
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

    const impactedModels = this._field.getModelsByPosition(position);
    if (impactedModels.length) {
      position.z = prevPosition.z;
      position.x = prevPosition.x;
      return position;
    }

    return position;
  }
}