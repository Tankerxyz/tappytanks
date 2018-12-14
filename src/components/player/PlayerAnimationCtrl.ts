import * as BABYLON from 'babylonjs';

export default class PlayerAnimationCtrl {
  private rotation: BABYLON.Animation;
  private position: BABYLON.Animation;

  private animatableModel: BABYLON.Mesh;
  private scene: BABYLON.Scene;
  private maxFrame: number;

  constructor(maxFrame: number,
              animatableModel: BABYLON.Mesh,
              scene: BABYLON.Scene,
              playerId?: string) {
    this.maxFrame = maxFrame;
    this.scene = scene;
    this.animatableModel = animatableModel;

    this.rotation = PlayerAnimationCtrl.createAnimation(
      `rotation-anim-player-${playerId}`,
       'rotation');
    this.position = PlayerAnimationCtrl.createAnimation(
      `position-anim-player-${playerId}`,
      'position'
    );
  }

  static createAnimation(
    name: string,
    targetProperty: string,
    dataType: number = BABYLON.Animation.ANIMATIONTYPE_VECTOR3) {
    return new BABYLON.Animation(
      name,
      targetProperty,
      60,
      dataType);
  }

  public startPositionAnimation(position: BABYLON.Vector3): void {
    this.position.setKeys([
      {
        frame: 0,
        value: this.animatableModel.position,
      },
      {
        frame: this.maxFrame,
        value: position,
      }
    ]);

    this.scene.beginDirectAnimation(this.animatableModel,
      [this.position],
      0,
      this.maxFrame,
      false,
      1);
  };

  public startRotationAnimation(rotation: BABYLON.Vector3): void {
    this.rotation.setKeys([
      {
        frame: 0,
        value: this.animatableModel.rotation,
      },
      {
        frame: this.maxFrame,
        value: rotation,
      }
    ]);

    this.scene.beginDirectAnimation(this.animatableModel,
      [this.rotation],
      0,
      this.maxFrame,
      false,
      1);
  };

}
