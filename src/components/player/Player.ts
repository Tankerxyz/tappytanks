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

    const rootUrl = "models/";
    const tankModelRootUrl = rootUrl+'tank/';
    const antennaRootUrl = rootUrl+'antenna/';

    const myMesh = BABYLON.MeshBuilder.CreateBox("myMesh", {size: 1}, this._scene);
    myMesh.visibility = 0;

    BABYLON.SceneLoader.ImportMesh("", tankModelRootUrl,
      "Tank_T1.obj", this._scene, (meshes) => {
      const scaling = 15.9;
      const heightOffset = -1.13;
      const widthOffset = 0.06;
      const tankMesh = meshes[0]; // T1 model

      const tankMaterial = new BABYLON.StandardMaterial("tankMaterial"+this.userID, this._scene);
      tankMaterial.diffuseTexture = new BABYLON.Texture(tankModelRootUrl+'textures/Diffuse.jpg', this._scene);
      // @ts-ignore
      // todo research how to change color properly
      // tankMaterial.diffuseColor = this._model.material.diffuseColor;
      tankMaterial.bumpTexture = new BABYLON.Texture(tankModelRootUrl+'textures/Normal.jpg', this._scene);
      tankMaterial.specularTexture = new BABYLON.Texture(tankModelRootUrl+'textures/Specular.jpg', this._scene);

      tankMesh.scaling.set(scaling, scaling, scaling);
      tankMesh.position.set(0, heightOffset, widthOffset);
      tankMesh.rotation.y = -(Math.PI / 2);
      tankMesh.material = tankMaterial;
      tankMesh.parent = this._model;

      myMesh.parent = this._model;

      const antennaScaling = 0.01;
      myMesh.scaling.set(antennaScaling, 0.008, antennaScaling);
      myMesh.position.set(-0.25, -0.18, 0.5);


      BABYLON.SceneLoader.ImportMesh("", antennaRootUrl, 'antenna.obj', this._scene, (meshes) => {

        const signalMesh = BABYLON.MeshBuilder.CreateBox("mySignal", { width: 1, depth: 1, height: 10 }, this._scene);
        signalMesh.parent = myMesh;
        signalMesh.position.set(3.5, 139, -5.5);

        const signalMaterial = new BABYLON.StandardMaterial('signalMaterial', this._scene);
        signalMesh.material = signalMaterial;
        signalMaterial.diffuseColor = this.playerMaterial.diffuseColor.clone();
        signalMaterial.emissiveColor = this.playerMaterial.diffuseColor.clone();
        signalMaterial.alpha = 0.6;

        meshes.forEach((m) => {
          const material = new BABYLON.StandardMaterial('myMat', this._scene);
          // #212121
          material.diffuseColor = BABYLON.Color3.FromHexString("#212121");
          m.parent = myMesh;
          m.material = material;
        })

      })
    });

      this._model = BABYLON.MeshBuilder.CreateBox(
        `playerModel${this.userID}`, {
          width: 1,
          height: 1,
          depth: 2
        },
        this._scene);
      this._model.position = position;
      this._model.rotation = rotation;
      this._model.visibility = 0;

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
