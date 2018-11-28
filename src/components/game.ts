import * as BABYLON from 'babylonjs';
import { AddLabelToMesh } from './gui';
import Controls from './Controls';
import Field from './Field';
import MoveController from './MoveController';

export default class Game {

  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.TargetCamera;
  private _light: BABYLON.Light;

  private _cone: BABYLON.Mesh;

  private _moveController: MoveController;

  constructor(canvasElement: string) {
    this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }


  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.actionManager = new BABYLON.ActionManager(this._scene);
    this._scene.debugLayer.show();

    this.createMainLight();
    this.createMainCone();
    this.createMainCamera();

    this._moveController = new MoveController(
      this._scene,
      new Field(10, 10, this._scene),
      this._cone);
  }

  doRender(): void {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  createMainCamera(): void {
    this._camera = new BABYLON.TargetCamera(
      'freeCamera-1',
      new BABYLON.Vector3(0, 15, 0),
      this._scene,
    );
    this._camera.setTarget(BABYLON.Vector3.Zero());
    this._camera.attachControl(this._canvas, false);
  }

  createMainLight(): void {
    this._light = new BABYLON.HemisphericLight(
      'hsLight-1',
      new BABYLON.Vector3(-50, 60, -50),
      this._scene,
    );
  }

  // todo create class Model with height/width etc. necessary props
  createMainCone(): void {
    this._cone = BABYLON.MeshBuilder.CreateCylinder(
      'cone', {
        diameterTop: 0,
        height: 1,
        tessellation: 96
      },
      this._scene);
    this._cone.position.y = 1;
    this._cone.rotation.x = -Math.PI/2;
  }

}