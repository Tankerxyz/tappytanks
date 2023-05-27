import * as BABYLON from 'babylonjs';
import keycode from 'keycode';

import { normalizeNewPositionFromRotationY } from '../../utils';

import AnimatableAction from '../action/AnimatableAction';
import Net from '../core/Net';

/**
 * Controls class for handling user input and animations.
 */
export default class Controls {
  private _scene: BABYLON.Scene;
  private actions: Array<AnimatableAction> = [];
  private animations: Array<BABYLON.Animation> = [];
  private movableObject: BABYLON.Mesh;
  private actionStarted = false;
  private maxFrame = 6;

  /**
   * Creates an instance of Controls.
   * @param {BABYLON.Scene} scene - The Babylon.js scene.
   * @param {BABYLON.Mesh} movableObject - The movable object.
   * @param {any} camera - The camera object.
   * @param {any} collisionNormalizer - The collision normalizer object.
   * @param {Net} net - The Net object.
   */
  constructor(
    scene: BABYLON.Scene,
    movableObject: BABYLON.Mesh,
    camera: any,
    collisionNormalizer: any,
    net: Net
  ) {
    this._scene = scene;
    this.movableObject = movableObject;

    const createAnimatableAction = (
      parameter: number,
      animationName: string,
      targetProperty: string,
      getAnimationKeysFn: () => { frame: number, value: BABYLON.Vector3 }[],
      movableObject: BABYLON.Mesh
    ) => {
      const animatableAction = new AnimatableAction(
        {
          trigger: BABYLON.ActionManager.OnKeyDownTrigger,
          parameter,
        },
        new BABYLON.Animation(animationName, targetProperty, 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3),
        getAnimationKeysFn,
        this.beginAnimation(movableObject),
        this.maxFrame,
        this.canRunAction,
        this.onActionStart,
        this.onActionEnd,
      );

      this.actions.push(animatableAction);
      this._scene.actionManager.registerAction(animatableAction.action);
      this.attachAnimation(movableObject)(animatableAction.animation);
    };

    const addAnimatableAction = (
      parameter: number,
      animationName: string,
      targetProperty: string,
      getAnimationKeysFn: () => { frame: number, value: BABYLON.Vector3 }[]
    ) => {
      createAnimatableAction(parameter, animationName, targetProperty, getAnimationKeysFn, movableObject);
    };


    /**
     * Rotated the mesh with animation
     * @param {number} rotationDirection - -1 to left, 1 to right
     */
    const rotateObject = (rotationDirection: number) => {
      const { x, y, z } = movableObject.rotation;
      const newRotation = new BABYLON.Vector3(x, y + rotationDirection * Math.PI / 2, z);

      net.changeRotation(newRotation);

      return [
        {
          frame: 0,
          value: new BABYLON.Vector3(x, y, z),
        },
        {
          frame: this.maxFrame,
          value: newRotation,
        },
      ];
    };

    const moveObject = (forwardDirection: number) => {
      const { x, y, z } = movableObject.position;
      const { newX, newZ } = normalizeNewPositionFromRotationY(movableObject.rotation.y);

      const newPosition = collisionNormalizer(
        new BABYLON.Vector3(Math.round(x + forwardDirection * newX), y, Math.round(z + forwardDirection * newZ)),
        movableObject.position
      );

      net.changePosition(newPosition);

      return [
        {
          frame: 0,
          value: new BABYLON.Vector3(x, y, z),
        },
        {
          frame: this.maxFrame,
          value: newPosition,
        },
      ];
    };

    // rotate left
    addAnimatableAction(
      keycode.codes.left,
      'animation_left',
      'rotation',
      () => rotateObject(-1),
    );

    // rotate right
    addAnimatableAction(
      keycode.codes.right,
      'animation_right',
      'rotation',
      () => rotateObject(1),
    );

    // move forward
    addAnimatableAction(
      keycode.codes.up,
      'animation_up',
      'position',
      () => moveObject(-1),
    );

    // move back
    addAnimatableAction(
      keycode.codes.down,
      'animation_down',
      'position',
      () => moveObject(1),
    );
  }

  /**
   * Begins the animation of the movable object.
   * @param {BABYLON.Mesh} movableObject - The movable object.
   * @returns {Function} - The function to begin the animation.
   */
  private beginAnimation = (movableObject: BABYLON.Mesh) => (
    animationParams: [[BABYLON.Animation], number, number, boolean, number, any]
  ) => {
    this._scene.beginDirectAnimation(movableObject, ...animationParams);
  };

  /**
   * Checks if an action can be run.
   * @returns {boolean} - Indicates if the action can be run.
   */
  private canRunAction = () => !this.actionStarted;

  /**
   * Callback function called when an action starts.
   */
  private onActionStart = () => {
    this.actionStarted = true;
  };

  /**
   * Callback function called when an action ends.
   */
  private onActionEnd = () => {
    this.actionStarted = false;
  };

  /**
   * Attaches an animation to the movable object.
   * @param {BABYLON.Mesh} movableObject - The movable object.
   * @returns {Function} - The function to attach the animation.
   */
  private attachAnimation = (movableObject: BABYLON.Mesh) => (animation: BABYLON.Animation) => {
    this.animations.push(animation);
    movableObject.animations.push(animation);
  };

  /**
   * Disposes the controls and cleans up registered actions and animations.
   */
  public dispose(): void {
    this.actions.forEach(a => this._scene.actionManager.unregisterAction(a.action));
    this.actions = [];
    this.movableObject.animations = this.movableObject.animations.filter(a => this.animations.indexOf(a) === -1);
    this.animations = [];
  }
}
