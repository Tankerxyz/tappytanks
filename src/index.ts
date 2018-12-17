import './styles/index.scss';
import Game from './components/Game';
import keycode from 'keycode'

window.addEventListener('DOMContentLoaded', () => {
  const game = new Game('#renderCanvas');
  const engine = document.querySelector('#renderCanvas');

  // todo remove this fucking shitty code
  const left = document.querySelector('.key.left');
  const right = document.querySelector('.key.right');
  const up = document.querySelector('.key.up');
  const down = document.querySelector('.key.down');

  left!.addEventListener('click', (e) => {
    engine!.dispatchEvent(new Event('focus'));
    // @ts-ignore
    engine.dispatchEvent(new KeyboardEvent('keydown',{ keyCode: keycode.codes.left }))
  });

  right!.addEventListener('click', (e) => {
    engine!.dispatchEvent(new Event('focus'));
    // @ts-ignore
    engine.dispatchEvent(new KeyboardEvent('keydown',{ keyCode: keycode.codes.right }))
  });

  up!.addEventListener('click', (e) => {
    engine!.dispatchEvent(new Event('focus'));
    // @ts-ignore
    engine.dispatchEvent(new KeyboardEvent('keydown',{ keyCode: keycode.codes.up }))
  });

  down!.addEventListener('click', (e) => {
    engine!.dispatchEvent(new Event('focus'));
    // @ts-ignore
    engine.dispatchEvent(new KeyboardEvent('keydown',{ keyCode: keycode.codes.down }))
  });
});
