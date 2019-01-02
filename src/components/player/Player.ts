import * as BABYLON from 'babylonjs';
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

  private gui: PlayerGUI;
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
      const text = `Player: (${this._id})
      hp: ${this.stat.hp}/${this.stat.maxHp}`;
      this.gui = new PlayerGUI({ text, model: this.model });
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

  public dispose(): void {
    this._model.dispose();
    this.gui.dispose();
  }
}
