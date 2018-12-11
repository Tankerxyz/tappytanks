import * as BABYLON from 'babylonjs';

interface PlayerOptions {
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
  id: string;
}

export default class Player {
  private _id: string;
  get id() { return this._id; }
  set id(value: string) { this._id = value; }

  private _model: BABYLON.Mesh;
  get model() { return this._model; }

  constructor(options: PlayerOptions, scene: BABYLON.Scene) {
    this._id = options.id;
    this.createModel(options.position, options.rotation, scene);
  }

  private createModel(
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3,
    scene: BABYLON.Scene,
    ): void {

      this._model = BABYLON.MeshBuilder.CreateCylinder(
        `playerModel${this.id}`, {
          diameterTop: 0,
          height: 1,
          tessellation: 96
        },
        scene);
      this._model.position = position;
      this._model.rotation = rotation;
  }

  public setPosition(position: BABYLON.Vector3): void {
    this._model.position = position;
  }

  public setRotation(rotation: BABYLON.Vector3): void {
    this._model.rotation = rotation;
  }
}
