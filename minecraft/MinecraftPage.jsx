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
  const [locked, setLocked] = useState(false);
  const [lockError, setLockError] = useState("");
  const [sensitivity, setSensitivity] = useState(1.2);
  const reloadOnRetry = useRef(false);
  const [staticView, setStaticView] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [chapter, setChapter] = useState(0),
    [mode, setMode] = useState("tour");
  const [panel, setPanel] = useState(null),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 700px), (pointer: coarse)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px), (pointer: coarse)");
    const update = () => {
      setMobile(query.matches);
      if (query.matches) {
        if (document.pointerLockElement) document.exitPointerLock();
        controller.mode = "tour";
        controller.lookTouch = false;
        controller.keys.clear();
        controller.drag = null;
        setMode("tour");
      }
    };
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [controller]);
  useEffect(() => {
    const update = () => {
      const active = !!document.pointerLockElement;
      controller.locked = active;
      setLocked(active);
      controller.keys.clear();
      controller.drag = null;
      if (!active) {
        controller.mode = "tour";
        setMode("tour");
      }
    };
    const failed = () => setLockError("Mouse capture was unavailable. Click to try again, or return to the guided path.");
    document.addEventListener("pointerlockchange", update);
    document.addEventListener("pointerlockerror", failed);
    return () => {
      document.removeEventListener("pointerlockchange", update);
      document.removeEventListener("pointerlockerror", failed);
      if (document.pointerLockElement) document.exitPointerLock();
    };
  }, [controller]);
  async function captureMouse() {
    const canvas = document.querySelector(".mc-scene canvas");
    setLockError("");
    if (!canvas?.requestPointerLock) {
      setLockError("This browser does not support mouse capture. Use the guided path instead.");
      return;
    }
    try {
      canvas.focus({ preventScroll: true });
      await canvas.requestPointerLock();
    } catch {
      setLockError("Mouse capture was unavailable. Click to try again, or return to the guided path.");
    }
  }
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
      if (document.pointerLockElement) document.exitPointerLock();
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
    if (next === "tour" && document.pointerLockElement) document.exitPointerLock();
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
  return (
    <main
      className={`mc-root ${staticView ? "mc-is-static" : ""} ${locked ? "mc-pointer-locked" : ""}`}
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
          {!mobile && <button
            className="mc-explore-toggle"
            onClick={() => changeMode(mode === "tour" ? "explore" : "tour")}
            aria-pressed={mode === "explore"}
            title={
              mode === "tour"
                ? "Walk freely with W A S D; move your mouse to look"
                : "Return to your saved scroll position"
            }
          >
            {mode === "tour" ? "Explore freely" : "Back to guided path"}
          </button>}
          {!mobile && mode === "explore" && !locked && !panel && (
            <div className="mc-explore-start">
              <span className="mc-eyebrow">FREE EXPLORATION</span>
              <h2>Make yourself at home.</h2>
              <p>W A S D to walk. Move your mouse to look.<br />Aim at a board and click to read. Press Esc to return.</p>
              <label htmlFor="mc-sensitivity">Mouse sensitivity <span>{sensitivity.toFixed(1)}</span></label>
              <input id="mc-sensitivity" type="range" min="0.4" max="2" step="0.1" value={sensitivity}
                onChange={(event) => { const value = Number(event.target.value); setSensitivity(value); controller.sensitivity = value / 1000; }} />
              <button className="mc-primary" onClick={captureMouse}>Click to explore</button>
              {lockError && <p role="alert">{lockError}</p>}
            </div>
          )}
          {locked && <div className="mc-crosshair" aria-hidden="true">+</div>}
          <nav className="mc-journey" aria-label="Portfolio timeline">
            <ol>
              {chapters.map((stop, index) => (
                <li key={stop.id} className={index <= chapter ? "is-reached" : ""}>
                  <button aria-current={chapter === index ? "step" : undefined}
                    onClick={() => {
                      changeMode("tour");
                      controller.target = stop.progress;
                      controller.saved = stop.progress;
                      controller.yaw = 0;
                      controller.pitch = 0;
                    }}>
                    <span className="mc-journey-dot">{String(index + 1).padStart(2, "0")}</span>
                    <span>{stop.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mc-chapter-caption">
            <span>CHAPTER {String(chapter + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span>
            <button onClick={() => openPanel(chapter === 0 ? "about" : chapters[chapter].id)}>
              {chapters[chapter].title} <span aria-hidden="true">↗</span>
            </button>
          </div>
          <p className="mc-gesture-hint">
            <span aria-hidden="true">↓</span> {mobile ? "Swipe up to follow the story" : mode === "explore" ? "W A S D to walk · Click to read · Esc to return" : "Scroll to follow the story · Drag to look"}
          </p>
          <AmbientMusic />
          <span className="mc-sr-only" aria-live="polite">
            Chapter {chapter + 1}: {chapters[chapter].label}
          </span>
        </>
      )}
      {panel && <Panel section={panel} theme={theme} onClose={closePanel} />}
    </main>
  );
}
