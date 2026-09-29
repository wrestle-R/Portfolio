import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../src/context/ThemeContext";
import { chapters } from "./data/layout";
import { createController } from "./controls/navigation";
import PortfolioContent from "./components/PortfolioContent";
import Panel from "./components/Panel";
import AmbientMusic from "./components/AmbientMusic";
import SceneBoundary from "./components/SceneBoundary";
import "./minecraft.css";
const HouseScene = lazy(() => import("./scene/HouseScene"));

export default function MinecraftPage() {
  const { theme } = useTheme();
  const controller = useRef(createController()).current;
  const reloadOnRetry = useRef(false);
  const [staticView, setStaticView] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [chapter, setChapter] = useState(0),
    [mode, setMode] = useState("tour");
  const [panel, setPanel] = useState(null),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  const [lookTouch, setLookTouch] = useState(false),
    [attempt, setAttempt] = useState(0);
  const readyCallback = useCallback(() => setReady(true), []);
  const failure = useCallback((message, reload = false) => {
    reloadOnRetry.current = reload;
    setError(message);
    setStaticView(true);
  }, []);
  const openPanel = useCallback(
    (section) => {
      controller.keys.clear();
      controller.drag = null;
      controller.paused = true;
      setPanel(section);
    },
    [controller],
  );
  const closePanel = () => {
    controller.paused = false;
    setPanel(null);
  };
  useEffect(() => {
    const title = document.title;
    document.title = "A little world · Russel Daniel Paul";
    const previous = [
      document.body.style.overflow,
      document.documentElement.style.overflow,
    ];
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.title = title;
      document.body.style.overflow = previous[0];
      document.documentElement.style.overflow = previous[1];
    };
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (mq.matches) setStaticView(true);
    };
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (staticView || ready) return;
    const timeout = setTimeout(
      () =>
        failure(
          "The world is taking longer than expected. Read the portfolio here, or retry the 3D view.",
        ),
      25000,
    );
    return () => clearTimeout(timeout);
  }, [staticView, ready, attempt, failure]);
  function changeMode(next) {
    controller.keys.clear();
    controller.drag = null;
    controller.mode = next;
    setMode(next);
  }
  function showWorld() {
    if (reloadOnRetry.current) {
      window.location.reload();
      return;
    }
    setError("");
    setReady(false);
    setAttempt((a) => a + 1);
    setStaticView(false);
  }
  function pad(key, pressed, event) {
    event.preventDefault();
    if (pressed) {
      event.currentTarget.setPointerCapture(event.pointerId);
      controller.keys.add(key);
    } else controller.keys.delete(key);
  }
  return (
    <main
      className={`mc-root ${staticView ? "mc-is-static" : ""}`}
      data-minecraft-theme={theme}
    >
      <Link to="/" className="mc-back">
        ← Back to portfolio
      </Link>
      <h1 className="mc-sr-only">Russel Daniel Paul’s Minecraft portfolio</h1>
      <a
        className="mc-reader-shortcut"
        href="#read-portfolio"
        onClick={(event) => {
          event.preventDefault();
          setStaticView(true);
        }}
      >
        Read an accessible version
      </a>
      {staticView ? (
        <div className="mc-static" tabIndex={-1}>
          {error && (
            <div role="status" className="mc-error">
              {error} <button onClick={showWorld}>Retry 3D ↗</button>
            </div>
          )}
          <div className="mc-static-intro">
            <span className="mc-eyebrow">THE PERSON BEHIND THE BLOCKS</span>
            <h1>
              Russel
              <br />
              Daniel Paul<span>.</span>
            </h1>
            <p>Fourth-year engineering student. Builder. Curious by default.</p>
            <button className="mc-primary" onClick={showWorld}>
              Take the house tour ↗
            </button>
          </div>
          {["about", "projects", "experience", "contact"].map((section, i) => (
            <section
              className="mc-static-section"
              key={section}
              aria-labelledby={`static-${section}`}
            >
              <span className="mc-eyebrow">
                0{i + 1} / {section.toUpperCase()}
              </span>
              <h2 id={`static-${section}`}>{chapters[i + 1].title}</h2>
              <PortfolioContent section={section} theme={theme} />
            </section>
          ))}
          <footer>
            Built one block at a time.{" "}
            <Link to="/">Back to the main portfolio ↗</Link>
          </footer>
        </div>
      ) : (
        <>
          <div className="mc-scene" data-mode={mode}>
            <SceneBoundary key={attempt} onFailure={failure}>
              <Suspense fallback={null}>
                <HouseScene
                  controller={controller}
                  onChapter={setChapter}
                  onReady={readyCallback}
                  onFailure={failure}
                  openPanel={openPanel}
                  theme={theme}
                />
              </Suspense>
            </SceneBoundary>
          </div>
          {!ready && (
            <div className="mc-loading" role="status">
              <div className="mc-loading-cube" />
              <span>Placing the last few blocks…</span>
              <button onClick={() => setStaticView(true)}>
                Read portfolio instead ↗
              </button>
            </div>
          )}
          <button
            className="mc-explore-toggle"
            onClick={() => changeMode(mode === "tour" ? "explore" : "tour")}
            aria-pressed={mode === "explore"}
            title={
              mode === "tour"
                ? "Walk freely with W A S D; drag to look"
                : "Return to your saved scroll position"
            }
          >
            {mode === "tour" ? "Explore freely" : "Back to guided path"}
          </button>
          <p className="mc-gesture-hint" aria-hidden="true">
            Scroll to enter · Drag to look · Click the signs
          </p>
          <AmbientMusic />
          <div className="mc-touch-controls">
            {mode === "tour" ? (
              <button
                className={lookTouch ? "is-active" : ""}
                aria-pressed={lookTouch}
                onClick={() => {
                  controller.lookTouch = !lookTouch;
                  setLookTouch(!lookTouch);
                }}
              >
                {lookTouch ? "Look: on" : "Look around"}
              </button>
            ) : (
              <div className="mc-pad" aria-label="Walking controls">
                {[
                  ["w", "↑", "Walk forward"],
                  ["a", "←", "Walk left"],
                  ["s", "↓", "Walk backward"],
                  ["d", "→", "Walk right"],
                ].map(([key, label, name]) => (
                  <button
                    key={key}
                    aria-label={name}
                    onPointerDown={(e) => pad(key, true, e)}
                    onPointerUp={(e) => pad(key, false, e)}
                    onPointerCancel={(e) => pad(key, false, e)}
                    onLostPointerCapture={() => controller.keys.delete(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="mc-sr-only" aria-live="polite">
            Chapter {chapter + 1}: {chapters[chapter].label}
          </span>
        </>
      )}
      {panel && <Panel section={panel} theme={theme} onClose={closePanel} />}
    </main>
  );
}
