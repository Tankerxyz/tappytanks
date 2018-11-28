export function normalizeNewPositionFromRotationZ(z: number, step: number = 1) {
  let newX = Math.sin(z);
  if (Math.abs(newX) === 1) {
    newX = newX < 0 ? newX - step : newX + step;
  }

  let newZ = Math.cos(z);
  if (Math.abs(newZ) === 1) {
    newZ = newZ < 0 ? newZ - step : newZ + step;
  }

  return { newZ, newX };
}