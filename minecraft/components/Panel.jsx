import { useEffect, useRef } from "react";
import PortfolioContent from "./PortfolioContent";
const titles = {
  about: "Hello, I’m Russel.",
  projects: "Selected work.",
  tools: "Tools of the trade",
  experience: "Learning by shipping.",
  contact: "Let’s build something.",
  help: "Make yourself at home.",
};
export default function Panel({ section, theme, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement,
      dialog = ref.current;
    dialog.showModal();
    dialog.querySelector("button").focus();
    return () => {
      dialog.close();
      previous?.focus?.({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="mc-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="mc-panel-title"
    >
      <div className="mc-panel-head">
        <span className="mc-eyebrow">RDP / FIELD NOTES</span>
        <button
          className="mc-icon"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
      </div>
      <div className="mc-panel-body">
        <h2 id="mc-panel-title">{titles[section] || "Behind the build."}</h2>
        <PortfolioContent section={section} theme={theme} />
      </div>
    </dialog>
  );
}
