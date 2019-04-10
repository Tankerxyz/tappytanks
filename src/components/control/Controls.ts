import * as BABYLON from 'babylonjs';
import keycode from 'keycode';
import AnimatableAction from '../action/AnimatableAction';

import { normalizeNewPositionFromRotationZ } from '../../utils';
import Net from '../core/Net';

export default class Controls {
  _scene: BABYLON.Scene;
  actions: Array<AnimatableAction> = [];
  animations: Array<BABYLON.Animation> = [];
  movableObject: BABYLON.Mesh;

  actionStarted: boolean = false;

  maxFrame: number = 6;

  constructor(scene: BABYLON.Scene, movableObject: BABYLON.Mesh, camera: any, collisionNormalizer: any, net: Net) {
    this._scene = scene;
    this.movableObject = movableObject;

    // rotate left
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.left,
      'animation_left',
      'rotation',
      () => {
        const { x, y, z } = movableObject.rotation;
        const newRotation = new BABYLON.Vector3(x, y - Math.PI/2, z);

        net.changeRotation(newRotation);

        return  [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: newRotation,
        }]
      }, movableObject), movableObject);


    // rotate right
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.right,
      'animation_right',
      'rotation',
      () => {
        const { x, y, z } = movableObject.rotation;
        const newRotation = new BABYLON.Vector3(x, y + Math.PI/2, z);

        net.changeRotation(newRotation);

        return  [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: newRotation,
        }]
      }, movableObject), movableObject);


    // move forward
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.up,
      'animation_up',
      'position',
      () => {
        const { x, y, z } = movableObject.position;
        const { newX, newZ } = normalizeNewPositionFromRotationZ(movableObject.rotation.y);

        // todo add collisionNormalizer to the server
        const newPosition = collisionNormalizer(new BABYLON.Vector3(Math.round(x - newX), y, Math.round(z - newZ)), movableObject.position);

        net.changePosition(newPosition);

        return  [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: newPosition,
        }]
      }, movableObject), movableObject);

    // move back
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.down,
      'animation_down',
      'position',
      () => {
        const { x, y, z } = movableObject.position;
        const { newX, newZ } = normalizeNewPositionFromRotationZ(movableObject.rotation.y);

        const newPosition = collisionNormalizer(new BABYLON.Vector3(Math.round(x + newX), y,Math.round(z + newZ)), movableObject.position);

        net.changePosition(newPosition);

        return [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: newPosition,
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
      this.animations.push(animation);
      movableObject.animations.push(animation);
    };
  }

  public dispose(): void {
    this.actions.forEach(a => this._scene.actionManager.unregisterAction(a.action));
    delete this.actions;
    // returns only not attached animations from this class
    this.movableObject.animations = this.movableObject.animations.filter(a => this.animations.indexOf(a) === -1);

    // @ts-ignore
    delete this.animations;
  }
}
