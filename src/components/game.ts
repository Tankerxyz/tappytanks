import * as BABYLON from 'babylonjs';
import { AddLabelToMesh } from './gui';
import Controls from './Controls';

export default class Game {

  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.TargetCamera;
  private _light: BABYLON.Light;
  private _controls: Controls;

  constructor(canvasElement: string) {
    this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
  }


  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.actionManager = new BABYLON.ActionManager(this._scene);

    this._light = new BABYLON.HemisphericLight(
      'hsLight-1',
      new BABYLON.Vector3(0, 1, 0),
      this._scene,
    );

    const sphere = BABYLON.MeshBuilder.CreateSphere(
      'sphere-1',
      {
        segments: 16,
        diameter: 2,
      },
      this._scene,
    );
    sphere.position.y = 1;
    new AddLabelToMesh(sphere);

    this._camera = new BABYLON.TargetCamera(
      'freeCamera-1',
      new BABYLON.Vector3(0, 15, 0),
      this._scene,
    );
    this._camera.setTarget(BABYLON.Vector3.Zero());
    this._camera.attachControl(this._canvas, false);

    const ground = BABYLON.MeshBuilder.CreateGround(
      'ground-1',
      {
        width: 10,
        height: 10,
        subdivisions: 4,
      },
      this._scene,
    );

    this._scene.debugLayer.show();

    this._controls = new Controls(this._scene, sphere);
  }

  doRender(): void {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  private attachControls(): void {

  }

}