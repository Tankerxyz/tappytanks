import * as BABYLON from 'babylonjs';
import keycode from 'keycode';

export default class Action {
  private readonly _action: BABYLON.ExecuteCodeAction;
  get action() { return this._action; }

  constructor(triggerOptions: any,
              action: any) {
    this._action = new BABYLON.ExecuteCodeAction(
      triggerOptions,
      action,
    );
  }
}
