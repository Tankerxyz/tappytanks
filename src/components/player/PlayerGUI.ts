import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';

export interface PlayerGUIOpts {
  text: string;
  model: BABYLON.Mesh;
}

export default class PlayerGUI {
  private ui: GUI.AdvancedDynamicTexture;
  private rectWrapper: GUI.Rectangle;
  private label: GUI.TextBlock;

  constructor(options: PlayerGUIOpts) {
    this.ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this.rectWrapper = new GUI.Rectangle();
    this.rectWrapper.adaptWidthToChildren = true;
    this.rectWrapper.adaptHeightToChildren = true;
    this.rectWrapper.width = "350px";
    this.rectWrapper.height = "60px";
    this.rectWrapper.cornerRadius = 20;
    this.rectWrapper.color = "Orange";
    this.rectWrapper.thickness = 4;
    this.rectWrapper.background = "green";

    this.ui.addControl(this.rectWrapper);

    this.label = new GUI.TextBlock();
    this.label.text = options.text;

    this.rectWrapper.addControl(this.label);

    this.rectWrapper.linkWithMesh(options.model);
    this.rectWrapper.linkOffsetY = -75;
  }

  public dispose(): void {
    this.ui.dispose();
    this.rectWrapper.dispose();
    this.label.dispose();
  }
}
