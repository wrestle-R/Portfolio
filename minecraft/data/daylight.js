// Fixed India Standard Time, independent of the visitor's device timezone.
const indiaClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
export const daylightPresets = {
  morning: {
    label: "Morning",
    sky: "#8bb6d4",
    horizon: "#f5dec0",
    fog: "#cbd9de",
    sun: "#ffdda1",
    sunPosition: [-22, 17, 24],
    sunPower: 2.1,
    ambient: 1.4,
    ambientSky: "#d0e0ec",
    ground: "#989393",
    lampPower: 22,
    glow: 0.24,
    stars: false,
  },
  afternoon: {
    label: "Afternoon",
    sky: "#6b9fc9",
    horizon: "#dce9ed",
    fog: "#d5e1e7",
    sun: "#fff3dd",
    sunPosition: [-16, 34, 12],
    sunPower: 2.5,
    ambient: 1.65,
    ambientSky: "#dbe8f3",
    ground: "#9b9690",
    lampPower: 16,
    glow: 0.16,
    stars: false,
  },
  evening: {
    label: "Evening",
    sky: "#666b98",
    horizon: "#e8b493",
    fog: "#b1a6b2",
    sun: "#ffb77a",
    sunPosition: [22, 10, 20],
    sunPower: 1.45,
    ambient: 0.95,
    ambientSky: "#b2b3d0",
    ground: "#716578",
    lampPower: 42,
    glow: 0.43,
    stars: false,
  },
  night: {
    label: "Night",
    sky: "#101c38",
    horizon: "#364563",
    fog: "#202e49",
    sun: "#a9c9ff",
    sunPosition: [-16, 27, 10],
    sunPower: 0.7,
    ambient: 0.65,
    ambientSky: "#90acd7",
    ground: "#434b67",
    lampPower: 65,
    glow: 0.55,
    stars: true,
  },
};
export function getISTPeriod(date = new Date()) {
  const parts = indiaClock.formatToParts(date);
  const hour = Number(parts.find((p) => p.type === "hour").value);
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}
