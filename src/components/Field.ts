import * as BABYLON from 'babylonjs';

export default class Field {
  private readonly _width: number;
  get width() { return this._width; }
  private readonly _height: number;
  get height() { return this._height; }

  private _model: BABYLON.Mesh;

  constructor(width: number, height: number, scene: BABYLON.Scene) {
    this._width = width;
    this._height = height;

    this.generateModel(scene);
  }

  private generateModel(scene: BABYLON.Scene) {
    // todo move to incapsulate component
    const material = new BABYLON.StandardMaterial("material", scene);
    material.diffuseColor = new BABYLON.Color3(0.08, 0.21, 0.47);

    this._model = BABYLON.MeshBuilder.CreateGround(
      'ground',
      {
        width: this._width,
        height: this._height,
        subdivisions: this._width / 2,
      },
      scene);

    this._model.material = material;


    // todo create some debug grid layer
    const lines = BABYLON.MeshBuilder.CreateLines(
      'lines',
      {
        points: [
          new BABYLON.Vector3(5, 0, -5),
          new BABYLON.Vector3(5, 0, 5)]
      });

    const lines2 = BABYLON.MeshBuilder.CreateLines(
      'lines',
      {
        points: [
          new BABYLON.Vector3(4, 0, -5),
          new BABYLON.Vector3(4, 0, 5)]
      });

    // lines.parent = this._model;

  }
}