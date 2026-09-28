import test from "node:test";
import assert from "node:assert/strict";
import { floorAt, moveWalker } from "./navigation.js";
import { HOUSE, sampleRail } from "../data/layout.js";
test("the complete camera rail stays inside navigable space with eye clearance", () => {
  for (let i = 0; i <= 2000; i++) {
    const { p } = sampleRail(i / 2000),
      floor = floorAt(p[0], p[2]);
    assert.notEqual(floor, null, `outside at ${i}`);
    assert.ok(
      Math.abs(p[1] - floor - HOUSE.eye) < 1e-8,
      `eye clearance at ${i}`,
    );
  }
});
test("walking cannot cross walls, stair rails, terrain edges or end planters", () => {
  const starts = [
    [0, -4.35, 23],
    [0, -1.35, 10],
    [0, 1.65, 2],
    [0, 1.65, -15],
    [0, 1.65, -27],
  ];
  for (const start of starts)
    for (let angle = 0; angle < 360; angle += 7) {
      const p = moveWalker(start, Math.cos(angle) * 100, Math.sin(angle) * 100);
      assert.notEqual(floorAt(p[0], p[2]), null);
      assert.ok(Math.abs(p[1] - floorAt(p[0], p[2]) - HOUSE.eye) < 1e-8);
    }
  assert.equal(floorAt(4.8, -27), null);
  assert.equal(floorAt(3.6, 10), null);
  assert.equal(floorAt(6, -10), null);
});
test("stairs connect both landings continuously in both directions", () => {
  let p = [0, -4.35, 23];
  for (let i = 0; i < 270; i++) {
    const next = moveWalker(p, 0, -0.1);
    assert.ok(Math.abs(next[1] - p[1]) < 0.051);
    p = next;
  }
  assert.ok(Math.abs(p[1] - 1.65) < 1e-8);
  for (let i = 0; i < 270; i++) p = moveWalker(p, 0, 0.1);
  assert.ok(Math.abs(p[2] - 23) < 1e-8);
  assert.ok(Math.abs(p[1] + 4.35) < 1e-8);
});
test("wall contact slides along the wall without allowing a diagonal escape", () => {
  const p = moveWalker([4.99, 1.65, -15], 1, 1);
  assert.ok(p[0] < 5);
  assert.ok(p[2] > -14.1);
});
