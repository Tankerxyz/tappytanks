import Action from './Action';
import * as BABYLON from 'babylonjs';

export default class AnimatableAction extends Action {
  private _animation: BABYLON.Animation;
  get animation() { return this._animation; }
  set animation(value) { this._animation = value; }

  constructor(triggerOptions: any,
              animation: any,
              getAnimationKeysFn: any,
              beginAnimation: any,
              maxFrame: number,
              canRunAction: () => boolean,
              onAnimationStart: () => void,
              onAnimationEnd: () => void,
              ) {
    super(triggerOptions, () => {
      if (!canRunAction()) return;
      onAnimationStart();

      this.animation.setKeys(getAnimationKeysFn());

      beginAnimation([[this.animation], 0, maxFrame, false, 1, () => {
        onAnimationEnd();
      }]);
    });

    this.animation = animation;
  }
}