import * as BABYLON from 'babylonjs';
import { AddLabelToMesh } from './gui';
import Controls from './Controls';
import Field, { FieldControllerOpts } from './Field';
import MoveController from './MoveController';
import Player from './Player';

import io from 'socket.io-client';

export default class Game {

  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.TargetCamera;
  private _light: BABYLON.Light;
  private _field: Field;

  private _moveController: MoveController;

  private _player: Player;
  private _restPlayers: Array<Player>;

  constructor(canvasElement: string) {
    this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);

    this.init();
  }

  init(): void {
    this.createScene();
    this.doRender();
  }

  createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.actionManager = new BABYLON.ActionManager(this._scene);
    this._scene.debugLayer.show();

    this.createMainLight();
    this.createMainPlayer();
    this.createMainCamera(this._player.model);

    this.createConnection();

    // this.createRestPlayers();
    //
    // this.createField();

    // this.createMoveController();
    //
    // this.createConnection();
  }

  // todo use as configured io and socket for whole app
  createConnection():void {
    const socket = io('ws://localhost:3000', {
      forceNew: true,
      path: '/socket.io/'
    });

    socket.on('connect', () => console.log('WS: Accept a connection.'));

    socket.on('field', (field: FieldControllerOpts) => {
      this.createField(field);
    });
  }

  doRender(): void {
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  createField(options: FieldControllerOpts): void {
    this._field = new Field(options, this._scene);
  }

  createPlayer(position: BABYLON.Vector3): Player {
    return new Player({
      model: this.createCone(position),
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

  createMainPlayer(): void {
    this._player = this.createPlayer(new BABYLON.Vector3(0, 1, 0));
  }

  createRestPlayers(): void {
    this._restPlayers = [
      this.createPlayer(new BABYLON.Vector3(4, 1, 6)),
      this.createPlayer(new BABYLON.Vector3(2, 1, 8)),
      this.createPlayer(new BABYLON.Vector3(-4, 1, -6)),
      this.createPlayer(new BABYLON.Vector3(4, 1, -4)),
    ];
  }

  createMoveController(): void {
    this._moveController = new MoveController(
      this._scene,
      this._field,
      this._player,
      this._camera
    );
  }

}
