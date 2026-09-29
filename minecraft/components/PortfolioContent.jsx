import portfolio, { preview } from "../data/content";
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
  if (section === "experience")
    return (
      <>
        <ol className="mc-experiences" aria-label="Experience timeline">
          {portfolio.experiences.map((e, i) => (
            <li className="mc-experience-step" key={`${e.company}-${e.period}`}>
              <span className="mc-timeline-node" aria-hidden="true">
                0{i + 1}
              </span>
              <article>
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
  if (section === "tools")
    return (
      <div className="mc-skills">
        {portfolio.skills.map((skill) => (
          <div key={skill.category}>
            <h4>{skill.category}</h4>
            <p>{skill.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    );
  if (section === "contact")
    return (
      <div className="mc-contact-content">
        <p>
          Have an idea, a project, or something interesting to talk about? I’d
          love to hear it.
        </p>
        <a className="mc-mail" href={`mailto:${portfolio.identity.email}`}>
          {portfolio.identity.email} ↗
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
            Scroll or swipe vertically to move. Drag the scene to look around.
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
            W / A / S / D walk. Drag or use arrows to look. Free exploration is available on desktop. Stairs and edges keep you
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
