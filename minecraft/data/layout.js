// Authored proportions, inferred from the recording; not a decoded world crop.
export const HOUSE = {
  halfWidth: 6,
  back: -29,
  height: 6,
  stairStart: 4,
  stairEnd: 16,
  ground: -6,
  eye: 1.65,
  radius: 0.3,
};
export const chapters = [
  {
    id: "entrance",
    label: "Arrival",
    title: "A little world. A lot of work.",
    detail: "Welcome to my corner of the mountains.",
    progress: 0,
  },
  {
    id: "about",
    label: "About",
    title: "Hello, I’m Russel.",
    detail: "Fourth-year engineering student. Builder. Curious by default.",
    progress: 0.25,
  },
  {
    id: "projects",
    label: "Projects",
    title: "Things I’ve built.",
    detail: "Five projects, from first idea to working product.",
    progress: 0.36,
  },
  {
    id: "experience",
    label: "Experience",
    title: "Learning by shipping.",
    detail: "Real systems, real devices, and a few hard problems.",
    progress: 0.76,
  },
  {
    id: "contact",
    label: "Tools + hello",
    title: "Tools of the trade",
    detail: "You’ve reached the end of the hall. Say hello.",
    progress: 1,
  },
];
// Piecewise smoothstep follows each corridor segment exactly (no spline overshoot).
export const rail = [
  { t: 0, p: [0, -4.35, 18.5], look: [0, 4, 0] },
  { t: 0.12, p: [0, -1.35, 10], look: [0, 2, -3] },
  { t: 0.25, p: [0, 1.65, 1], look: [0, 2, -12] },
  { t: 0.36, p: [0, 1.65, -5], look: [-5.7, 2.5, -5] },
  { t: 0.39, p: [0, 1.65, -5], look: [-5.7, 2.5, -5] },
  { t: 0.45, p: [0, 1.65, -10], look: [-5.7, 2.5, -10] },
  { t: 0.48, p: [0, 1.65, -10], look: [-5.7, 2.5, -10] },
  { t: 0.54, p: [0, 1.65, -15], look: [-5.7, 2.5, -15] },
  { t: 0.57, p: [0, 1.65, -15], look: [-5.7, 2.5, -15] },
  { t: 0.63, p: [0, 1.65, -20], look: [-5.7, 2.5, -20] },
  { t: 0.66, p: [0, 1.65, -20], look: [-5.7, 2.5, -20] },
  { t: 0.71, p: [0, 1.65, -25], look: [-5.7, 2.5, -25] },
  { t: 0.73, p: [0, 1.65, -25], look: [-5.7, 2.5, -25] },
  { t: 0.76, p: [-1.5, 1.65, -15], look: [5.7, 2.5, -15] },
  { t: 0.83, p: [-1.5, 1.65, -20], look: [5.7, 2.5, -20] },
  { t: 0.90, p: [-1.5, 1.65, -25], look: [5.7, 2.5, -25] },
  { t: 1, p: [0, 1.65, -23], look: [0, 2.5, -29] },
];
export function sampleRail(t) {
  const index = rail.findIndex((point) => point.t >= Math.max(0.000001, t));
  const b = rail[index < 0 ? rail.length - 1 : index];
  const a = rail[Math.max(0, (index < 0 ? rail.length - 1 : index) - 1)];
  let f = Math.min(1, Math.max(0, (t - a.t) / (b.t - a.t || 1)));
  f = f * f * (3 - 2 * f);
  const p = a.p.map((v, i) => v + (b.p[i] - v) * f);
  p[1] = (p[2] > 16 ? -6 : p[2] > 4 ? -(p[2] - 4) / 2 : 0) + HOUSE.eye;
  return { p, look: a.look.map((v, i) => v + (b.look[i] - v) * f) };
}
export function chapterAt(t) {
  return t < 0.22 ? 0 : t < 0.32 ? 1 : t < 0.745 ? 2 : t < 0.95 ? 3 : 4;
}
