import portfolio, { preview } from "../data/content";
import { Code2, PanelsTopLeft, Server, Database, Cloud, Wrench, ArrowUpRight } from "lucide-react";

const toolIcons = { Languages: Code2, Frontend: PanelsTopLeft, Backend: Server, Databases: Database, "Cloud & Infra": Cloud, "Dev Tools": Wrench };
export function Project({ project, theme }) {
  return (
    <article className="mc-project-detail">
      <img
        src={preview(project, theme)}
        alt={`${project.name} application preview`}
        onError={(e) => {
          e.currentTarget.hidden = true;
        }}
      />
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="mc-tags">
        {project.tech.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="mc-links">
        <a href={project.url} target="_blank" rel="noreferrer">
          {project.primaryLabel || "Live demo"} ↗
        </a>
        <a href={project.github} target="_blank" rel="noreferrer">
          Source code ↗
        </a>
      </div>
    </article>
  );
}
export default function PortfolioContent({ section, theme }) {
  if (section.startsWith("project-"))
    return (
      <Project
        project={portfolio.projects.find((p) => `project-${p.id}` === section)}
        theme={theme}
      />
    );
  if (section === "projects")
    return (
      <div className="mc-project-list">
        {portfolio.projects.map((p) => (
          <Project key={p.id} project={p} theme={theme} />
        ))}
      </div>
    );
  if (section === "experience" || section.startsWith("experience-"))
    return (
      <>
        <ol className="mc-experiences" aria-label="Experience timeline">
          {portfolio.experiences.filter((e) => section === "experience" || e.id === section).map((e) => (
            <li className="mc-experience-step" key={`${e.company}-${e.period}`}>
              <span className="mc-timeline-node" aria-hidden="true">
                0{portfolio.experiences.indexOf(e) + 1}
              </span>
              <article>
                <img className="mc-company-logo" src={e.logo} alt={`${e.company} logo`} />
                <span className="mc-eyebrow">{e.period}</span>
                <h3>{e.company}</h3>
                <p className="mc-role">{e.role} · Intern</p>
                <ul>
                  {e.achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <div className="mc-tags">
                  {e.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </>
    );
  if (section === "contact")
    return (
      <div className="mc-contact-content">
        <div className="mc-skills">
          {portfolio.skills.map((skill, index) => {
            const Icon = toolIcons[skill.category] || Wrench;
            return (
              <section className="mc-tool-group" key={skill.category}>
                <div className="mc-tool-label">
                  <span className="mc-tool-symbol" aria-hidden="true"><Icon size={18} strokeWidth={1.5} /></span>
                  <div><span className="mc-tool-number">{String(index + 1).padStart(2, "0")}</span><h3>{skill.category}</h3></div>
                </div>
                <ul className="mc-tool-items">{skill.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            );
          })}
        </div>
        <section className="mc-contact-invite" aria-labelledby="mc-contact-title">
          <span className="mc-eyebrow">NEXT UP / YOUR IDEA</span>
          <h3 id="mc-contact-title">Let’s build something.</h3>
          <p>
            Have an idea, a project, or something interesting to talk about? I’d
            love to hear it.
          </p>
          <a className="mc-contact-email" href={`mailto:${portfolio.identity.email}`}>
            <span>{portfolio.identity.email}</span><ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <div className="mc-links">
            <a href={portfolio.identity.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a
              href={portfolio.identity.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
            <a href="/resume">Résumé ↗</a>
          </div>
        </section>
      </div>
    );
  if (section === "help")
    return (
      <div className="mc-help-content">
        <p>
          A small house tour, at your pace. Use the music button to switch the
          soft instrumental soundtrack on or off.
        </p>
        <dl>
          <dt>Guided tour</dt>
          <dd>
            Scroll or swipe vertically to move. On desktop, hold and drag to look around on the guided path.
            On phones, swipe up to follow the story.
          </dd>
          <dt>Keyboard</dt>
          <dd>
            Focus the scene. Arrow keys look; Page Up / Down change chapters;
            Home / End go to the start / finish. Press Enter to open the current
            chapter’s details.
          </dd>
          <dt>Explore</dt>
          <dd>
            Click “Click to explore” to capture your mouse. W / A / S / D walk; move your mouse to look and aim at boards to read. Escape releases the mouse and returns to the guided path. Free exploration is available on desktop. Stairs and edges keep you
            inside the house.
          </dd>
          <dt>Back to tour</dt>
          <dd>
            Your tour chapter is saved while you explore. Return whenever you’re
            ready.
          </dd>
          <dt>Prefer reading?</dt>
          <dd>
            The accessible version has the same projects, experience, and
            contact links without the 3D scene.
          </dd>
        </dl>
      </div>
    );
  return (
    <>
      <p className="mc-lead">{portfolio.identity.bio}</p>
      <p>
        I’m a fourth-year computer engineering student working across full-stack
        development, AI / ML, and IoT. I like taking an idea all the way to
        something people can use.
      </p>
      <div className="mc-about-note">
        <span>AWAY FROM THE KEYBOARD</span>
        <p>Football. Running. And a few too many blocks.</p>
      </div>
      <p>
        This little house is inspired by my Minecraft world. Follow the purple
        path to see what I’ve been working on.
      </p>
    </>
  );
}
