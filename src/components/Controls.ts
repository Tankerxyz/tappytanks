import * as BABYLON from 'babylonjs';
import keycode from 'keycode';
import Action from './Action';
import AnimatableAction from './AnimatableAction';

export default class Controls {
  _scene: BABYLON.Scene;
  actions: Array<AnimatableAction> = [];

  actionStarted: boolean = false;

  maxFrame: number = 6;

  constructor(scene: BABYLON.Scene, movableObject: BABYLON.Mesh) {
    this._scene = scene;

    // left
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.left,
      'animation_left',
      'position.x',
      () => {
        return  [{
          frame: 0,
          value: movableObject.position.x
        }, {
          frame: this.maxFrame,
          value: movableObject.position.x + 1
        }]
      }, movableObject), movableObject);


    // right
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.right,
      'animation_right',
      'position.x',
      () => {
        return  [{
          frame: 0,
          value: movableObject.position.x
        }, {
          frame: this.maxFrame,
          value: movableObject.position.x - 1
        }]
      }, movableObject), movableObject);


    // up
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.up,
      'animation_up',
      'position.z',
      () => {
        return  [{
          frame: 0,
          value: movableObject.position.z
        }, {
          frame: this.maxFrame,
          value: movableObject.position.z - 1
        }]
      }, movableObject), movableObject);


    // down
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.down,
      'animation_up',
      'position.z',
      () => {
        return  [{
          frame: 0,
          value: movableObject.position.z
        }, {
          frame: this.maxFrame,
          value: movableObject.position.z + 1
        }]
      }, movableObject), movableObject);
  }

  beginAnimation(movableObject: BABYLON.Mesh) {
    return (animationParams: [[BABYLON.Animation], number, number, boolean, number, any]) => {
      this._scene.beginDirectAnimation(movableObject, ...animationParams);
    };
  }

  createAnimatableAction(parameter: number,
                         animationName: string,
                         targetProperty: string,
                         getAnimationKeysFn: () => Array<{frame: number, value: number}>,
                         movableObject: BABYLON.Mesh,
                         ) {
    return new AnimatableAction({
      trigger: BABYLON.ActionManager.OnKeyDownTrigger,
      parameter,
    },
      new BABYLON.Animation(animationName, targetProperty,60, BABYLON.Animation.ANIMATIONTYPE_FLOAT),
      getAnimationKeysFn,
      this.beginAnimation(movableObject),
      this.maxFrame,
      this.canRunAction,
      this.onActionStart,
      this.onActionEnd,
      );
  }

  canRunAction = () => {
    return this.actionStarted === false;
  };

  onActionStart = () => {
    this.actionStarted = true;
  };

  onActionEnd = () => {
    this.actionStarted = false;
  };

  addAnimatableAction(animatableAction: AnimatableAction, movableObject: BABYLON.Mesh) {
    this.actions.push(animatableAction);
    this._scene.actionManager.registerAction(animatableAction.action);
    this.attachAnimation(movableObject)(animatableAction.animation);
  }

  attachAnimation(movableObject: BABYLON.Mesh) {
    return (animation: BABYLON.Animation) => {
      movableObject.animations.push(animation);
    };
  }
}