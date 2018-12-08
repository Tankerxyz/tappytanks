import * as BABYLON from 'babylonjs';

interface PlayerOptions {
  model: BABYLON.Mesh;
}

export default class Player {
  private readonly _model: BABYLON.Mesh;
  get model() { return this._model; }

  constructor(options: PlayerOptions) {
    this._model = options.model;
  }
}