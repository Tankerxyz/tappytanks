import * as BABYLON from 'babylonjs';
import io from 'socket.io-client';
import { FieldControllerOpts } from './Field';
import PlayersController from '../player/PlayersController';

export interface NetOpts {
  url: string,
  playersCtrl: PlayersController,
  events: {
    onField: (field: FieldControllerOpts) => void,
    onCreatePlayerSuccess: (player: any) => void,
  }
}

export default class Net {
  private socket: any;
  private playersCtrl: PlayersController;

  constructor(options: NetOpts) {
    const socket = io(options.url, {
      forceNew: true
    });
    this.socket = socket;
    this.playersCtrl = options.playersCtrl;

    socket.on('connect', () => console.log('WS: Accept a connection.'));

    socket.on('field', options.events.onField);

    socket.on('create-player-success', options.events.onCreatePlayerSuccess);

    socket.on('player-joined', (player: any) => {
      console.log('player-joined: ', player);

      this.playersCtrl.addPlayer(player);

    });

    socket.on('player-leaved', (playerId: string) => {
      console.log('player-leaved: ', playerId);

      this.playersCtrl.removePlayer(playerId);
    });


    socket.on('player-changed-rotation', (player: any) => {
      console.log('player-changed-rotation', player);

      this.playersCtrl.changePlayerRotation(player);
    });

    socket.on('player-changed-position', (player: any) => {
      console.log('player-changed-position', player);

      this.playersCtrl.changePlayerPosition(player);
    });
  }

  public changeRotation(newRotation: BABYLON.Vector3) {
    this.socket.emit('change-rotation', newRotation);
  }

  public changePosition(newPosition: BABYLON.Vector3) {
    this.socket.emit('change-position', newPosition);
  }
};