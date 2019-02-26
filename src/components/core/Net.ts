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
  },
  query: object
}

export default class Net {
  private socket: any;
  private playersCtrl: PlayersController;

  constructor(options: NetOpts) {
    const socket = io(options.url, {
      forceNew: true,
      query: options.query
    });
    this.socket = socket;
    this.playersCtrl = options.playersCtrl;

    socket.on('field', options.events.onField);
    socket.on('create-player-success', options.events.onCreatePlayerSuccess);

    this.initEventsHandling();
  }

  private initEventsHandling(): void {
    this.socket.on('connect', () => console.log('WS: Accept a connection.'));

    this.socket.on('player-joined', (player: any) => {
      console.log('player-joined: ', player);

      this.playersCtrl.addPlayer(player);

    });

    this.socket.on('player-leaved', (playerId: string) => {
      console.log('player-leaved: ', playerId);

      this.playersCtrl.removePlayer({id: playerId});
    });


    this.socket.on('player-changed-rotation', (player: any) => {
      console.log('player-changed-rotation', player);

      this.playersCtrl.changePlayerRotation(player);
    });

    this.socket.on('player-changed-position', (player: any) => {
      console.log('player-changed-position', player);

      this.playersCtrl.changePlayerPosition(player);
    });
  }

  public changeRotation(newRotation: BABYLON.Vector3): void {
    this.socket.emit('change-rotation', newRotation);
  }

  public changePosition(newPosition: BABYLON.Vector3): void {
    this.socket.emit('change-position', newPosition);
  }
};
