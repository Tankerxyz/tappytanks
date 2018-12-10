import * as BABYLON from 'babylonjs';

interface PlayerOptions {
  model: BABYLON.Mesh;
  id?: string;
}

export default class Player {
  private _id: string;
  get id() { return this._id; }
  set id(value: string) { this._id = value; }
  private readonly _model: BABYLON.Mesh;
  get model() { return this._model; }

  constructor(options: PlayerOptions) {
    this._model = options.model;

    if (options.id) {
      this._id = options.id;
    }
  }

  public setPosition(position: BABYLON.Vector3): void {
    this._model.position = position;
  }

  public setRotation(rotation: BABYLON.Vector3): void {
    this._model.rotation = rotation;
  }
}
