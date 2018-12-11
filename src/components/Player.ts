import * as BABYLON from 'babylonjs';

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
  private rotationAnimation: BABYLON.Animation;
  private positionAnimation: BABYLON.Animation;

  constructor(options: PlayerOptions, scene: BABYLON.Scene) {
    this._id = options.id;
    this._scene = scene;
    this.createModel(options.position, options.rotation);

    if (options.animatable) {
      this.rotationAnimation = new BABYLON.Animation(`rotation-anim-player-${this.id}`, 'rotation', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)
      this.positionAnimation = new BABYLON.Animation(`position-anim-player-${this.id}`, 'position', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3)
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
    if (this.positionAnimation) {

      this.positionAnimation.setKeys([
        {
          frame: 0,
          value: this._model.position,
        },
        {
          frame: maxFrame,
          value: position,
        }
      ]);

      this._scene.beginDirectAnimation(this._model,
        [this.positionAnimation],
        0,
        maxFrame,
        false,
        1);
      }
    else {
      this._model.position = position;
    }
  }

  public setRotation(rotation: BABYLON.Vector3): void {
    if (this.rotationAnimation) {

      this.rotationAnimation.setKeys([
        {
          frame: 0,
          value: this._model.rotation,
        },
        {
          frame: maxFrame,
          value: rotation,
        }
      ]);

      this._scene.beginDirectAnimation(this._model,
        [this.rotationAnimation],
        0,
        maxFrame,
        false,
        1);
      }
    else {
      this._model.rotation = rotation;
    }
  }
}
