import { useEffect, useState } from "react";
import { daylightPresets, getISTPeriod } from "../data/daylight";

export default function useDaylight() {
  function current() {
    // Local art-direction previews; production always follows IST.
    const preview =
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).get("time");
    return Object.hasOwn(daylightPresets, preview) ? preview : getISTPeriod();
  }
  const [period, setPeriod] = useState(current);
  useEffect(() => {
    const refresh = () => setPeriod(current());
    const timer = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  return { period, preset: daylightPresets[period] };
}
