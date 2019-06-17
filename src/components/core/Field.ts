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
      material.diffuseTexture = new BABYLON.Texture("models/crate/crate.png", this._scene);
      material.diffuseTexture.hasAlpha = true;
      fieldWall.material = material;
      fieldWall.position = wall.position;

      this._walls.push(fieldWall);
    });
  }

  private generateModel(scene: BABYLON.Scene) {
    const getGroundMaterial = (diffUrl: string, bumpUrl: string, uScale: number, vScale: number) => {
      const material = new BABYLON.StandardMaterial("material", scene) as any;
      material.diffuseTexture = new BABYLON.Texture(diffUrl, scene);
      material.diffuseTexture.uScale = uScale;
      material.diffuseTexture.vScale = vScale;
      material.bumpTexture = new BABYLON.Texture(bumpUrl, scene);
      material.bumpTexture.uScale = uScale;
      material.bumpTexture.vScale = vScale;
      material.bumpTexture.level = 0.5;
      material.useParallax = true;
      material.useParallaxOcclusion = true;
      material.parallaxScaleBias = 1;
      material.specularPower = 600.0;
      material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);

      return material;
    };

    const rootUrl = "models/ground/";

    const frontGroundMaterial = getGroundMaterial(rootUrl+"front-ground.jpg", rootUrl+"front-ground-normal.png", 9, 9);
    const sideGroundMaterial = getGroundMaterial(rootUrl+"side-ground.jpg", rootUrl+"side-ground-normal.png", 9, 0.5);

    this._model = BABYLON.MeshBuilder.CreateGround(
      'ground',
      {
        width: this._width,
        height: this._height,
        subdivisions: this._width / 2
      },
      scene);
    this._model.material = frontGroundMaterial;

    // creation left, right, front, back sides of ground
    const planeZB = BABYLON.MeshBuilder.CreatePlane("myPlane", {
      width: this._width,
      height: 1
    }, scene);
    planeZB.material = sideGroundMaterial;
    planeZB.position.y = -0.5;

    const planeZF = planeZB.clone();
    const planeXB = planeZB.clone();
    const planeXF = planeZB.clone();

    planeZB.position.z = -(this._width / 2);
    planeZF.position.z = this._width / 2;
    planeXB.position.x = -(this._height / 2);
    planeXF.position.x = this._height / 2;

    planeZF.rotation.y = Math.PI;
    planeXB.rotation.y = Math.PI / 2;
    planeXF.rotation.y = -(Math.PI / 2);


    function checkIfGroundLoaded() {
      return sideGroundMaterial.diffuseTexture.isReady() && sideGroundMaterial.bumpTexture.isReady()
        && frontGroundMaterial.diffuseTexture.isReady() && frontGroundMaterial.bumpTexture.isReady();
    }

    const timeoutCheck = () => {
      if (checkIfGroundLoaded()) {
        this._scene.getEngine().loadingScreen.hideLoadingUI();
      } else {
        setTimeout(timeoutCheck, 1000);
      }
    };

    timeoutCheck();
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
