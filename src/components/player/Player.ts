import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import PlayerAnimationCtrl from './PlayerAnimationCtrl';
import PlayerGUI from './PlayerGUI';

interface Statistic {
  hp: number;
  maxHp: number;
}

interface PlayerOptions {
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
  stat: Statistic,
  color: string;
  userID: string;
  animatable?: boolean,
  withGui?: boolean,
}

const maxFrame = 6;

export default class Player {
  private _userID: string;
  get userID() { return this._userID; }
  set userID(value: string) { this._userID = value; }

  private _model: BABYLON.Mesh;
  get model() { return this._model; }

  private stat: Statistic;

  private gui: PlayerGUI;
  private _scene: BABYLON.Scene;
  private animationCtrl: PlayerAnimationCtrl;
  private playerMaterial: BABYLON.StandardMaterial;

  constructor(options: PlayerOptions, scene: BABYLON.Scene) {
    this._userID = options.userID;
    this._scene = scene;
    this.createModel(options.position, options.rotation);
    this.stat = options.stat;

    if (options.animatable) {
      this.animationCtrl = new PlayerAnimationCtrl(maxFrame, this._model, scene, this.userID);
    }

    // temp
    if (options.withGui) {
      const text = `Player: (${this._userID})
      hp: ${this.stat.hp}/${this.stat.maxHp}`;
      this.gui = new PlayerGUI({ text, model: this.model });
    }

    if (options.color) {
      this.changeColor(options.color);
    }
  }

  public changeColor(color: string) {
    this.playerMaterial.diffuseColor = BABYLON.Color3.FromHexString(color);
  }

  private createModel(
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3
    ): void {

    var url = "https://likablemeekdiscussion--viktorgavrilov.repl.co/models/Tank_fbx.FBX";



    BABYLON.SceneLoader.ImportMesh("", "https://likablemeekdiscussion--viktorgavrilov.repl.co/models/",
      "Tank_fbx.glb", this._scene, (meshes, ...args) => {
      const tankMesh = meshes[1];
      tankMesh.scaling.set(1.5, 1.5, 1.5);
      tankMesh.position.set(0, 2, 0)// = this._model.position.clone();
      tankMesh.rotation.set(0, 1, 0);
      tankMesh.parent = this._model;

      // @ts-ignore
      window.model = this._model

      // tankMesh.rotation.set(0, this._model.rotation.y, 0);
      console.log(meshes, args);

    });

    // const loader = BABYLON.SceneLoader.Load("https://likablemeekdiscussion--viktorgavrilov.repl.co/models/", "Tank_fbx.glb", this._scene.getEngine(),  (scene) => {
    //   // Create a default arc rotate camera and light.
    //
    //   console.log(scene);
    //
    //   // scene.createDefaultCameraOrLight(true, true, true);
    //
    //   // // The default camera looks at the back of the asset.
    //   // // Rotate the camera by 180 degrees to the front of the asset.
    //   // scene.activeCamera.alpha += Math.PI;
    //
    //   // this._model = scene.;
    //   this._model.position = position;
    //   this._model.rotation = rotation;
    // }) as any;
    //
    // let tankModel: any = null;
    // let tankMaterial: any = null;
    //
    // loader.onMeshLoaded = (mesh: any) => {
    //   console.log('mesh: ', mesh);
    //   tankModel = mesh;
    // };
    //
    // loader.onMaterialLoaded = (material: any) => {
    //   console.log('material: ', material);
    //   tankMaterial = material;
    // };
    //
    // loader.onComplete = () => {
    //   console.log('complete');
    //   this._model.dispose();
    //   this._model = tankModel;
    //   this._model.material = tankMaterial;
    //   this._model.position = position;
    //   this._model.rotation = rotation;
    // };

      this._model = BABYLON.MeshBuilder.CreateBox(
        `playerModel${this.userID}`, {
          width: 1,
          height: 1,
          depth: 2
        },
        this._scene);
      this._model.position = position;
      this._model.rotation = rotation;

      this.playerMaterial = new BABYLON.StandardMaterial(`playerMaterial${this.userID}`, this._scene);
      this.playerMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);

      this._model.material = this.playerMaterial;
  }

  public setPosition(position: BABYLON.Vector3): void {
    if (this.animationCtrl) {
      this.animationCtrl.startPositionAnimation(position);
    } else {
      this._model.position = position;
    }
  }

  public setRotation(rotation: BABYLON.Vector3): void {
    if (this.animationCtrl) {
      this.animationCtrl.startRotationAnimation(rotation);
    } else {
      this._model.rotation = rotation;
    }
  }

  public dispose(): void {
    this._model.dispose();
    this.gui.dispose();
  }
}
