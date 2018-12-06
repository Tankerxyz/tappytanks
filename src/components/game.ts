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
      new Field({
        width: 18,
        height: 18,
        debug: true,
        fieldWalls: [{
          position: new BABYLON.Vector3(-2, 1, -2),
          size: 2
        }, {
          position: new BABYLON.Vector3(-8, 1, 2),
          size: 2
        }, {
          position: new BABYLON.Vector3(-8, 1, 8),
          size: 2
        }, {
          position: new BABYLON.Vector3(6, 1, 0),
          size: 2
        }],
        models: [
          this.createCone(new BABYLON.Vector3(4, 1, 6)),
          this.createCone(new BABYLON.Vector3(2, 1, 8)),
          this.createCone(new BABYLON.Vector3(-4, 1, -6)),
          this.createCone(new BABYLON.Vector3(4, 1, -4)),
        ]
      }, this._scene),
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
      lockedTarget
    );

    (this._camera as any).cameraAcceleration = 0.04;
    (this._camera as any).radius = 6;
    (this._camera as any).heightOffset = 3;

    (window as any).camera = this._camera;
  }

  createMainLight(): void {
    this._light = new BABYLON.HemisphericLight(
      'hsLight-1',
      new BABYLON.Vector3(-50, 60, -50),
      this._scene,
    );
  }

  // todo move to global controller to handle models creation
  createCone(position: BABYLON.Vector3): BABYLON.Mesh {
    const cone =  BABYLON.MeshBuilder.CreateCylinder(
      'cone', {
        diameterTop: 0,
        height: 1,
        tessellation: 96
      },
      this._scene);
    cone.position = position;
    cone.rotation.x = -Math.PI/2;

    return cone;
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