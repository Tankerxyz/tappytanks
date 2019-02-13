import * as BABYLON from 'babylonjs';
import Player from '../player/Player';

export interface FieldControllerOpts {
  width: number;
  height: number;
  debug?: boolean;
  walls?: Array<FieldWall>;
  players?: Array<Player>;
}

interface FieldWall {
  position: BABYLON.Vector3;
  size: number;
}

export default class Field {
  private readonly _width: number;
  get width() { return this._width; }
  private readonly _height: number;
  get height() { return this._height; }

  private readonly _scene: BABYLON.Scene;
  private _model: BABYLON.Mesh;
  private _walls: Array<BABYLON.Mesh> = [];
  private _players: Array<Player> = [];

  constructor(options: FieldControllerOpts, scene: BABYLON.Scene) {
    this._width = options.width;
    this._height = options.height;
    this._scene = scene;

    this.generateModel(scene);

    if (options.debug) {
      this.createDebugLayerLines(2);
    }

    if (options.walls) {
      this.generateFieldWalls(options.walls);
    }

    if (options.players) {
      this._players = options.players;
    }
  }

  private generateFieldWalls(fieldWalls: Array<FieldWall>) {
    fieldWalls.forEach((wall, i) => {
      const fieldWall = BABYLON.MeshBuilder.CreateBox(`fieldWall${i}`, {
        size: wall.size
      }, this._scene);
      const material = new BABYLON.StandardMaterial(`fialdWallMat${i}`, this._scene);
      material.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/crate.png", this._scene);
      material.diffuseTexture.hasAlpha = true;
      fieldWall.material = material;
      fieldWall.position = wall.position;

      this._walls.push(fieldWall);
    });
  }

  private generateModel(scene: BABYLON.Scene) {
    // todo move to incapsulate component
    const material = new BABYLON.StandardMaterial("material", scene);
    material.diffuseColor = new BABYLON.Color3(0.08, 0.21, 0.47);

    this._model = BABYLON.MeshBuilder.CreateGround(
      'ground',
      {
        width: this._width,
        height: this._height,
        subdivisions: this._width / 2,
      },
      scene);

    this._model.material = material;
  }

  private createDebugLayerLines(step: number) {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    // start point: -Z(w / 2) AXIS
    for (let z = -halfWidth; z <= halfWidth; z += step) {
      BABYLON.MeshBuilder.CreateLines(
        `line_z${z ? z : `(${z})`}`,
        {
          points: [
            new BABYLON.Vector3(z, 0.01, halfWidth),
            new BABYLON.Vector3(z, 0.01, -halfWidth)]
        });
    }

    for (let x = -halfHeight; x <= halfHeight; x += step) {
      BABYLON.MeshBuilder.CreateLines(
        `line_x${x ? x : `(${x})`}`,
        {
          points: [
            new BABYLON.Vector3(halfHeight, 0.01, x),
            new BABYLON.Vector3(-halfHeight, 0.01, x)]
        });
    }
  }


  public getWallsByPosition(position: BABYLON.Vector3): Array<BABYLON.Mesh> {
    return this._walls.filter((wall) => {
      if (position.x === wall.position.x && position.z === wall.position.z) {
        return wall;
      }
    });
  }

  public getPlayerModelByPosition(position: BABYLON.Vector3): Array<Player> {
    return this._players.filter((player) => {
      const model = player.model;
      if (position.x === model.position.x && position.z === model.position.z) {
        return model;
      }
    });
  }

  public dispose(): void {
    this._walls.map((w) => w.dispose());
  }
}
