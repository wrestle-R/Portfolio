import { useEffect, useRef } from "react";
import portfolio from "../data/content";
import PortfolioContent from "./PortfolioContent";
const descriptions = {
  about: "A little about the person behind this world.",
  projects: "Ideas turned into working products. Pick a build and take a closer look.",
  experience: "A growing collection of things learned by building real systems.",
  contact: "The languages, frameworks, and everyday essentials behind my work.",
  help: "A few pointers for your visit.",
};
const titles = {
  about: "Hello, I’m Russel.",
  projects: "Selected work.",
  experience: "Learning by shipping.",
  contact: "Tools of the trade",
  help: "Make yourself at home.",
};
export default function Panel({ section, theme, onClose }) {
  const ref = useRef(null);
  const experience = portfolio.experiences.find((item) => item.id === section);
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
      className={`mc-dialog${section === "contact" ? " mc-workbench" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) {
          const bounds = e.currentTarget.getBoundingClientRect();
          if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) onClose();
        }
      }}
      aria-labelledby="mc-panel-title"
    >
      <div className="mc-panel-head">
        <div className="mc-journal-brand"><span className="mc-journal-mark" aria-hidden="true">R</span>
          <div><span className="mc-eyebrow">RUSSEL DANIEL PAUL</span><span className="mc-journal-label">Notes from the workshop</span></div>
        </div>
        <button
          className="mc-icon"
          onClick={onClose}
          aria-label="Close details"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="mc-panel-body">
        <header className="mc-panel-intro">
          <span className="mc-eyebrow">{experience ? "EXPERIENCE / FIELD NOTES" : section.startsWith("project-") ? "SELECTED BUILD" : section === "contact" ? "THE WORKBENCH" : section.toUpperCase()}</span>
          <h2 id="mc-panel-title">{experience?.company || titles[section] || "Behind the build."}</h2>
          <p>{experience ? `${experience.period} · ${experience.role}` : descriptions[section] || "A closer look at the idea, the tools, and the finished product."}</p>
        </header>
        <PortfolioContent section={section} theme={theme} />
      </div>
    </dialog>
  );
}
