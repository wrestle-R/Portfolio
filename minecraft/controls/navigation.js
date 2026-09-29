import { HOUSE } from "../data/layout.js";
export function floorAt(x, z) {
  const r = HOUSE.radius;
  if (z < HOUSE.back + r || z > 25 - r) return null;
  if (z > -28.1 && z < -25.9 && Math.abs(x) > 3.7) return null;
  // Timber frames and the solid side partitions between display alcoves.
  for (const front of [-2, -7, -12, -17, -22, -27]) {
    if (
      z > front - 1 - r &&
      z < front + r &&
      (x < -3 + r || (x > 3 - r && ![-17, -22].includes(front)))
    )
      return null;
  }
  if (z > -r && z < 3.4 + r && Math.abs(x) > 3 - r) return null;
  if (z < 0) return Math.abs(x) < HOUSE.halfWidth - 0.7 - r ? 0 : null;
  if (z < 4) return Math.abs(x) < 4.5 - r ? 0 : null;
  if (z <= 16) return Math.abs(x) < 3.5 - r ? -(z - 4) / 2 : null;
  return Math.abs(x) < 7 - r ? -6 : null;
}
export function moveWalker(position, dx, dz) {
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / (HOUSE.radius / 2)));
  let [x, , z] = position;
  for (let i = 0; i < steps; i++) {
    if (floorAt(x + dx / steps, z) !== null) x += dx / steps;
    if (floorAt(x, z + dz / steps) !== null) z += dz / steps;
  }
  return [x, (floorAt(x, z) ?? -6) + HOUSE.eye, z];
}
export function createController() {
  return {
    progress: 0,
    target: 0,
    yaw: 0,
    pitch: 0,
    mode: "tour",
    paused: false,
    locked: false,
    sensitivity: 0.0012,
    lookTouch: false,
    keys: new Set(),
    drag: null,
    moved: false,
    position: [0, -4.35, 23],
    saved: 0,
    jump: true,
  };
}
