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
    this.createMainCamera(this._cone);

    this._moveController = new MoveController(
      this._scene,
      new Field(18, 18, this._scene),
      this._cone,
      this._camera
      );
  }

  doRender(): void {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  createMainCamera(lockedTarget: BABYLON.Mesh): void {
    this._camera = new BABYLON.FollowCamera(
      'freeCamera-1',
      new BABYLON.Vector3(0, 6, 8),
      this._scene,
      lockedTarget,
    );

    (this._camera as any).cameraAcceleration = 0.01;
    (window as any).camera = this._camera;
    this._camera.inertia = 0;
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