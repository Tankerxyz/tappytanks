import * as BABYLON from 'babylonjs';
import PlayerAnimationCtrl from './PlayerAnimationCtrl';

interface PlayerOptions {
  position: BABYLON.Vector3,
  rotation: BABYLON.Vector3,
  id: string;
  animatable?: boolean
}

const maxFrame = 6;

export default class Player {
  private _id: string;
  get id() { return this._id; }
  set id(value: string) { this._id = value; }

  private _model: BABYLON.Mesh;
  get model() { return this._model; }

  private _scene: BABYLON.Scene;
  private animationCtrl: PlayerAnimationCtrl;

  constructor(options: PlayerOptions, scene: BABYLON.Scene) {
    this._id = options.id;
    this._scene = scene;
    this.createModel(options.position, options.rotation);

    if (options.animatable) {
      this.animationCtrl = new PlayerAnimationCtrl(maxFrame, this._model, scene, this.id);
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
