export default function LoadingScreen({ download, onRead }) {
  const progress = download.total > 0
    ? Math.min(100, Math.round((download.loaded / download.total) * 100))
    : null;
  const preparing = progress === 100;
  const status = preparing
    ? "Preparing your world…"
    : progress === null
      ? "Opening your world…"
      : "Loading terrain…";

  return (
    <section className="mc-loading" aria-label="Loading the Minecraft portfolio">
      <div className="mc-loading-backdrop" aria-hidden="true" />
      <div className="mc-loading-content">
        <div className="mc-loading-brand" aria-label="Russel’s World">
          <span className="mc-loading-kicker">A PORTFOLIO YOU CAN EXPLORE</span>
          <span className="mc-loading-wordmark" aria-hidden="true">RUSSEL’S</span>
          <span className="mc-loading-edition" aria-hidden="true">WORLD</span>
          <span className="mc-loading-splash">Come on in!</span>
        </div>

        <p className="mc-loading-intro">A little world. A lot of work.<br />Make yourself at home.</p>

        <div className="mc-loading-controls">
          <div className="mc-loading-status" role="status" aria-live="polite">
            {status}
          </div>
          <div
            className={`mc-loading-progress ${progress === null || preparing ? "is-indeterminate" : ""}`}
            role="progressbar"
            aria-label={preparing ? "Preparing the scene" : "World download"}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={preparing ? undefined : progress ?? undefined}
            aria-valuetext={preparing || progress === null ? status : `${progress}% downloaded`}
          >
            <span style={{ width: progress === null || preparing ? undefined : `${progress}%` }} />
          </div>
          <p className="mc-loading-detail">
            {preparing ? "Lighting the lanterns. Making yourself at home." : progress === null ? "Gathering the last few blocks" : `${progress}% of the world downloaded`}
          </p>
          <button className="mc-loading-button" onClick={onRead}>
            Read portfolio instead <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <footer className="mc-loading-footer" aria-hidden="true">
        <span>RDP · Portfolio edition</span>
        <span>Scroll to explore once you’re inside <span aria-hidden="true">↓</span></span>
      </footer>
    </section>
  );
}
