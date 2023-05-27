import * as BABYLON from 'babylonjs';
import 'babylonjs-inspector';
import axios from 'axios';

// @ts-ignore
import Stats from 'stats.js';

import Field, { FieldControllerOpts } from './core/Field';
import Player from './player/Player';
import Net from './core/Net';

import MoveController from './control/MoveController';
import PlayersController from './player/PlayersController';
import MissileController from "./control/MissileController";

declare var process: any;

/**
 * The main Game class.
 */
export default class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.FollowCamera;
  private _light: BABYLON.Light;
  private _field: Field;
  private _skybox: any;

  private _mainPlayer: Player;
  private _moveController: MoveController;
  private _playersController: PlayersController;
  private _missileController: MissileController;
  private _net: Net;
  private _stats: Stats;

  /**
   * Creates a new instance of the Game class.
   * @param canvasElement The ID or selector of the canvas element.
   */
  constructor(canvasElement: string) {
    this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, false, { antialias: false }, false);
    this._stats = new Stats();
    document.body.appendChild(this._stats.dom);

    this.init();
  }

  /**
   * Initializes the game.
   */
  private init(): void {
    this.createScene();
    this.doRender();
  }

  /**
   * Creates the game scene.
   */
  private createScene(): void {
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.actionManager = new BABYLON.ActionManager(this._scene);
    this._engine.loadingScreen.displayLoadingUI();

    if (process.env.NODE_ENV === 'development') {
      this._scene.debugLayer.show();
    }

    this.createMainLight();
    this.createSkybox();
    this.createMainPlayer();
    this.createMainCamera(this._mainPlayer.model);
    this._playersController = new PlayersController([], this._scene);
    this._missileController = new MissileController(this._scene, this._mainPlayer);
    this.createConnection();
  }

  /**
   * Creates the skybox.
   */
  private createSkybox(): void {
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, this._scene);
    skybox.position.y = -250;
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", this._scene);
    skyboxMaterial.backFaceCulling = false;

    // todo change build settings for using my files
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("models/skybox/skybox", this._scene);

    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    this._skybox = skybox;
  }

  /**
   * Creates a connection to the server.
   */
  private async createConnection(): Promise<void> {
    const { data: { userID } } = await axios.get('http://localhost:3000/session', { withCredentials: true });

    this._net = new Net({
      url: 'ws://localhost:3000',
      query: {
        userID
      },
      playersCtrl: this._playersController,
      events: {
        onField: this.onField,
        onCreatePlayerSuccess: this.onCreatePlayerSuccess
      }
    });
  }

  /**
   * Renders the game scene.
   */
  private doRender(): void {
    this._engine.runRenderLoop(() => {
      this._scene.render();
      this._stats.update();
      this._missileController.update();
    });

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  /**
   * Event handler for the field creation.
   * @param field The field controller options.
   */
  private onField = (field: FieldControllerOpts) => {
    this._playersController.removeAll();
    this.createField({
      width: field.width,
      height: field.height,
      debug: field.debug,
      walls: field.walls,
      players: this._playersController.getPlayers()
    });

    if (field.players) {
      field.players.forEach((p) => this._playersController.addPlayer(p));
    }
  };

  /**
   * Event handler for the successful creation of the player.
   * @param player The created player.
   */
  private onCreatePlayerSuccess = (player: any) => {
    console.log('create-player-success: ', player);
    this._mainPlayer.userID = player.userID;
    this._mainPlayer.setPosition(player.position);
    this._mainPlayer.setRotation(player.rotation);
    this._mainPlayer.changeColor(player.color);

    this._camera.dispose();
    this.createMainCamera(this._mainPlayer.model);
    this.createMoveController();
  };

  /**
   * Creates the game field.
   * @param options The field controller options.
   */
  private createField(options: FieldControllerOpts): void {
    if (this._field) {
      this._field.dispose();
      delete this._field;
    }

    this._field = new Field(options, this._scene);
  }

  /**
   * Creates the main camera.
   * @param lockedTarget The target mesh to follow.
   */
  private createMainCamera(lockedTarget: BABYLON.Mesh): void {
    this._camera = new BABYLON.FollowCamera(
      'freeCamera-1',
      new BABYLON.Vector3(lockedTarget.position.x, lockedTarget.position.y + 2, lockedTarget.position.z),
      this._scene,
      lockedTarget
    );

    this._camera.cameraAcceleration = 0.04;
    this._camera.radius = 6;
    this._camera.heightOffset = 3;
  }

  /**
   * Creates the main light.
   */
  private createMainLight(): void {
    this._light = new BABYLON.HemisphericLight('hsLight-1', new BABYLON.Vector3(-50, 60, -50), this._scene);
  }

  /**
   * Creates the main player.
   */
  private createMainPlayer(): void {
    this._mainPlayer = new Player(
      {
        position: new BABYLON.Vector3(0, 1, 0),
        rotation: new BABYLON.Vector3(-Math.PI / 2, 0, 0),
        color: '#ffffff',
        stat: { hp: 100, maxHp: 100 },
        userID: 'temp-userID',
      },
      this._scene
    );
  }

  /**
   * Creates the move controller.
   */
  private createMoveController(): void {
    if (this._moveController) {
      this._moveController.dispose();
      // @ts-ignore
      this._moveController = null;
      delete this._moveController;
    }

    this._moveController = new MoveController(
      this._scene,
      this._field,
      this._mainPlayer,
      this._camera,
      this._net
    );
  }
}
