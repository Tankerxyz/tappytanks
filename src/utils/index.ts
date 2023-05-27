export function normalizeNewPositionFromRotationY(y: number, step: number = 1) {
  let newX = Math.sin(y);
  if (Math.abs(newX) === 1) {
    newX = newX < 0 ? newX - step : newX + step;
  }

  let newZ = Math.cos(y);
  if (Math.abs(newZ) === 1) {
    newZ = newZ < 0 ? newZ - step : newZ + step;
  }

  return { newZ, newX };
}
