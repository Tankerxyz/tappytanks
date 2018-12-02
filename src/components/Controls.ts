import * as BABYLON from 'babylonjs';
import keycode from 'keycode';
import AnimatableAction from './AnimatableAction';

import { normalizeNewPositionFromRotationZ } from '../utils';

export default class Controls {
  _scene: BABYLON.Scene;
  actions: Array<AnimatableAction> = [];

  actionStarted: boolean = false;

  maxFrame: number = 6;

  constructor(scene: BABYLON.Scene, movableObject: BABYLON.Mesh, camera: any, collisionNormalizer: any) {
    this._scene = scene;

    // rotate left
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.left,
      'animation_left',
      'rotation',
      () => {
        const { x, y, z } = movableObject.rotation;

        const newCosZ = ~~Math.cos(z - Math.PI/2);
        const newSinZ = ~~Math.sin(z - Math.PI/2);

        // UP
        if (newSinZ === 0 && newCosZ === 1) {
          camera.position.x = movableObject.position.x;
          camera.position.z = movableObject.position.z + 8;
        }
        // RIGHT
        else if (newSinZ === 1 && newCosZ === 0) {
          camera.position.x = movableObject.position.x - 8;
          camera.position.z = movableObject.position.z;
        }
        // DOWN
        else if (newSinZ === -1 && newCosZ === 0) {
          camera.position.x = movableObject.position.x;
          camera.position.z = movableObject.position.z - 8;
        }
        // LEFT
        else if (newSinZ === 0 && newCosZ === -1) {
          camera.position.x = movableObject.position.x + 8;
          camera.position.z = movableObject.position.z;
        }

        return  [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: new BABYLON.Vector3(x, y, z - Math.PI/2)
        }]
      }, movableObject), movableObject);


    // rotate right
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.right,
      'animation_right',
      'rotation',
      () => {
        const { x, y, z } = movableObject.rotation;

        return  [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: new BABYLON.Vector3(x, y, z + Math.PI/2)
        }]
      }, movableObject), movableObject);


    // move forward
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.up,
      'animation_up',
      'position',
      () => {
        const { x, y, z } = movableObject.position;
        const { newX, newZ } = normalizeNewPositionFromRotationZ(movableObject.rotation.z);

        return  [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: collisionNormalizer(new BABYLON.Vector3(x - newX, y, z - newZ), movableObject.position)
        }]
      }, movableObject), movableObject);

    // move back
    this.addAnimatableAction(this.createAnimatableAction(keycode.codes.down,
      'animation_down',
      'position',
      () => {
        const { x, y, z } = movableObject.position;
        const { newX, newZ } = normalizeNewPositionFromRotationZ(movableObject.rotation.z);

        return [{
          frame: 0,
          value: new BABYLON.Vector3(x, y, z)
        }, {
          frame: this.maxFrame,
          value: collisionNormalizer(new BABYLON.Vector3(x + newX, y,z + newZ), movableObject.position)
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