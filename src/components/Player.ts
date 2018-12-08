import * as BABYLON from 'babylonjs';

interface PlayerOptions {
  model: BABYLON.Mesh;
}

export default class Player {
  private readonly _model: BABYLON.Mesh;

  constructor(options: PlayerOptions) {
    this._model = options.model;
  }
}