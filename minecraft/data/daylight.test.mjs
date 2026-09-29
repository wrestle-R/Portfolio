import test from "node:test";
import assert from "node:assert/strict";
import { getISTPeriod, daylightPresets } from "./daylight.js";

test("IST transitions use exact boundaries including the previous UTC date", () => {
  const cases = [
    ["2026-09-28T23:29:59.999Z", "night"],
    ["2026-09-28T23:30:00.000Z", "morning"],
    ["2026-09-29T05:29:59.999Z", "morning"],
    ["2026-09-29T05:30:00.000Z", "afternoon"],
    ["2026-09-29T11:29:59.999Z", "afternoon"],
    ["2026-09-29T11:30:00.000Z", "evening"],
    ["2026-09-29T14:29:59.999Z", "evening"],
    ["2026-09-29T14:30:00.000Z", "night"],
    ["2026-09-29T18:30:00.000Z", "night"],
  ];
  for (const [instant, expected] of cases) {
    assert.equal(getISTPeriod(new Date(instant)), expected, instant);
    assert.ok(daylightPresets[expected]);
  }
});

test("different device timezones do not change the IST period", () => {
  const original = process.env.TZ;
  try {
    for (const zone of ["UTC", "America/Los_Angeles", "Asia/Tokyo"]) {
      process.env.TZ = zone;
      assert.equal(getISTPeriod(new Date("2026-09-29T14:30:00Z")), "night");
      assert.equal(getISTPeriod(new Date("2026-09-29T23:30:00Z")), "morning");
    }
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});
