import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import PlayerAnimationCtrl from './PlayerAnimationCtrl';

interface Statistic {
  hp: number;
  maxHp: number;
}

interface PlayerOptions {
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
  stat: Statistic,
  id: string;
  animatable?: boolean,
  withGui?: boolean,
}

const maxFrame = 6;

export default class Player {
  private _id: string;
  get id() { return this._id; }
  set id(value: string) { this._id = value; }

  private _model: BABYLON.Mesh;
  get model() { return this._model; }

  private stat: Statistic;

  private _scene: BABYLON.Scene;
  private animationCtrl: PlayerAnimationCtrl;

  constructor(options: PlayerOptions, scene: BABYLON.Scene) {
    this._id = options.id;
    this._scene = scene;
    this.createModel(options.position, options.rotation);
    this.stat = options.stat;

    if (options.animatable) {
      this.animationCtrl = new PlayerAnimationCtrl(maxFrame, this._model, scene, this.id);
    }

    // temp
    if (options.withGui) {
      var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      var rect1: any = new GUI.Rectangle();
      rect1.width = 0.3;
      rect1.adaptWidthToChildren = true;
      rect1.height = "40px";
      rect1.cornerRadius = 20;
      rect1.color = "Orange";
      rect1.thickness = 4;
      rect1.background = "green";

      advancedTexture.addControl(rect1);

      var label = new GUI.TextBlock();
      label.text = `Player: (${this._id})`;
      rect1.addControl(label);

      rect1.linkWithMesh(this._model);
      rect1.linkOffsetY = -75;
    }
  }

  private createModel(
    position: BABYLON.Vector3,
    rotation: BABYLON.Vector3
    ): void {

      this._model = BABYLON.MeshBuilder.CreateCylinder(
        `playerModel${this.id}`, {
          diameterTop: 0,
          height: 1,
          tessellation: 96
        },
        this._scene);
      this._model.position = position;
      this._model.rotation = rotation;


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
}
