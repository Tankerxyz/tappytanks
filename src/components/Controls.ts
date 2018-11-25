import * as BABYLON from 'babylonjs';
import keycode from 'keycode';
import Action from './Action';
import AnimatableAction from './AnimatableAction';

export default class Controls {
  _scene: BABYLON.Scene;
  actions: Array<AnimatableAction> = [];

  actionStarted: boolean = false;

  maxFrame: number = 6;

  constructor(scene: BABYLON.Scene, movableObject: BABYLON.Mesh, collisionNormalizer: any) {
    this._scene = scene;

    // rotate left
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.left,
      'animation_left',
      'rotation',
      () => {
        return  [{
          frame: 0,
          value: new BABYLON.Vector3(movableObject.rotation.x, movableObject.rotation.y, movableObject.rotation.z)
        }, {
          frame: this.maxFrame,
          value: new BABYLON.Vector3(
            movableObject.rotation.x,
            movableObject.rotation.y,
            movableObject.rotation.z - Math.PI/2)
        }]
      }, movableObject), movableObject);


    // rotate right
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.right,
      'animation_right',
      'rotation',
      () => {
        return  [{
          frame: 0,
          value: new BABYLON.Vector3(movableObject.rotation.x, movableObject.rotation.y, movableObject.rotation.z)
        }, {
          frame: this.maxFrame,
          value: new BABYLON.Vector3(
            movableObject.rotation.x,
            movableObject.rotation.y,
            movableObject.rotation.z + Math.PI/2)
        }]
      }, movableObject), movableObject);


    // move forward
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.up,
      'animation_up',
      'position',
      () => {
        return  [{
          frame: 0,
          value: new BABYLON.Vector3(movableObject.position.x, movableObject.position.y, movableObject.position.z)
        }, {
          frame: this.maxFrame,
          value: collisionNormalizer(new BABYLON.Vector3(
            movableObject.position.x - Math.sin(movableObject.rotation.z),
            movableObject.position.y,
            movableObject.position.z - Math.cos(movableObject.rotation.z)))
        }]
      }, movableObject), movableObject);

    // move back
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.down,
      'animation_down',
      'position',
      () => {
        return  [{
          frame: 0,
          value: new BABYLON.Vector3(movableObject.position.x, movableObject.position.y, movableObject.position.z)
        }, {
          frame: this.maxFrame,
          value: collisionNormalizer(new BABYLON.Vector3(
            movableObject.position.x + Math.sin(movableObject.rotation.z),
            movableObject.position.y,
            movableObject.position.z + Math.cos(movableObject.rotation.z)))
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
                         getAnimationKeysFn: () => Array<{frame: number, value: BABYLON.Vector3}>,
                         movableObject: BABYLON.Mesh,
                         ) {
    return new AnimatableAction({
      trigger: BABYLON.ActionManager.OnKeyDownTrigger,
      parameter,
    },
      new BABYLON.Animation(animationName, targetProperty,60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3),
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