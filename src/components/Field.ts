import * as BABYLON from 'babylonjs';

interface FieldControllerOpts {
  width: number;
  height: number;
  debug?: boolean;
  fieldWalls?: Array<FieldWall>;
  models?: Array<BABYLON.Mesh>;
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
  private _models: Array<BABYLON.Mesh> = [];

  constructor(options: FieldControllerOpts, scene: BABYLON.Scene) {
    this._width = options.width;
    this._height = options.height;
    this._scene = scene;

    this.generateModel(scene);

    if (options.debug) {
      this.createDebugLayerLines(2);
    }

    if (options.fieldWalls) {
      this.generateFieldWalls(options.fieldWalls);
    }

    if (options.models) {
      this._models = options.models;
    }
  }

  private generateFieldWalls(fieldWalls: Array<FieldWall>) {
    fieldWalls.forEach((wall, i) => {
      const fieldWall = BABYLON.MeshBuilder.CreateBox(`fieldWall${i}`, {
        size: wall.size
      }, this._scene);
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
}