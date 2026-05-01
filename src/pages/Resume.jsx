import React, { useState } from "react";
import { ArrowLeft, Download, ExternalLink, FileImage, FileText, Mail, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const resumePdf = "/Resume/Resume.pdf";
const resumeImage = "/Resume/Resume.jpg";

const resumeFacts = [
  "computer engineering",
  "mern | next | ai/ml | iot",
  "projects, internships, and build notes",
];

const Resume = () => {
  const [imageFailed, setImageFailed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const downloadResume = (format) => {
    const link = document.createElement("a");
    link.href = format === "pdf" ? resumePdf : resumeImage;
    link.download = format === "pdf" ? "Russel_Daniel_Paul_Resume.pdf" : "Russel_Daniel_Paul_Resume.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "oklch(var(--background))" }}>
      <header className="fixed inset-x-0 top-0 z-40 mx-auto w-full max-w-6xl px-4 pt-4 md:pt-5">
        <nav
          className="mx-auto flex max-w-4xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur-xl md:px-5"
          style={{
            backgroundColor: "oklch(var(--background) / 0.78)",
            borderColor: "oklch(var(--border))",
          }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-semibold tracking-wide transition-opacity hover:opacity-70"
            style={{ color: "oklch(var(--foreground))" }}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>RDP</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(event) => toggleTheme(event.currentTarget)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80"
              style={{ backgroundColor: "oklch(var(--muted))", color: "oklch(var(--foreground))" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href="mailto:russeldanielpaul@gmail.com"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-80 md:w-auto md:px-4 md:text-sm md:font-medium"
              style={{ backgroundColor: "oklch(var(--primary))", color: "oklch(var(--primary-foreground))" }}
              aria-label="Email Russel Daniel Paul"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:ml-2 md:inline">Contact</span>
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10 px-4 pb-12 pt-28 md:pb-16">
        <div className="mx-auto w-full max-w-4xl space-y-8">
          <section>
            <article
              className="rounded-xl border p-5 transition-colors duration-300 ease-in-out hover:bg-muted/50 md:p-6"
              style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="font-mono text-sm">
                  {/* <p>
                    <span style={{ color: "oklch(var(--muted-foreground))" }}>$</span> open resume.pdf
                  </p> */}
                  <h1 className="mt-3 text-3xl font-bold tracking-normal md:text-4xl" style={{ color: "oklch(var(--foreground))" }}>
                    Resume
                  </h1>
                  {/* <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>
                    A clean copy of my current resume, kept here for quick viewing, downloading, and sharing.
                  </p> */}
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  {resumeFacts.map((fact) => (
                    <span
                      key={fact}
                      className="rounded-full border px-3 py-1.5 text-xs font-mono"
                      style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}
                    >
                      {fact}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => downloadResume("pdf")}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "oklch(var(--primary))", color: "oklch(var(--primary-foreground))" }}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => downloadResume("image")}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted/70"
                  style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}
                >
                  <FileImage className="h-4 w-4" aria-hidden="true" />
                  Image
                </button>
                <a
                  href={resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors hover:bg-muted/70"
                  style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open
                </a>
              </div>
            </article>
          </section>

          <section>
            <article
              className="overflow-hidden rounded-xl border transition-colors duration-300 ease-in-out hover:bg-muted/50"
              style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
            >
              <div
                className="flex flex-col gap-3 border-b p-5 md:flex-row md:items-center md:justify-between md:p-6"
                style={{ borderColor: "oklch(var(--border))" }}
              >
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: "oklch(var(--foreground))" }}>
                    Preview
                  </h2>
                  {/* <p className="mt-1 text-sm" style={{ color: "oklch(var(--muted-foreground))" }}>
                    Same file, rendered as an image for fast scanning.
                  </p> */}
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-mono" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}>
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Resume.pdf
                </div>
              </div>

              <div className="p-3 md:p-5">
                <div
                  className="mx-auto max-w-3xl overflow-hidden rounded-lg border bg-white"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  {imageFailed ? (
                    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
                      <FileText className="h-8 w-8 text-neutral-500" aria-hidden="true" />
                      <p className="text-sm font-medium text-neutral-700">Resume preview could not be loaded.</p>
                      <a className="text-sm font-semibold text-neutral-950 underline underline-offset-4" href={resumePdf} target="_blank" rel="noopener noreferrer">
                        Open the PDF instead
                      </a>
                    </div>
                  ) : (
                    <img
                      src={resumeImage}
                      alt="Russel Daniel Paul Resume"
                      className="h-auto w-full"
                      onError={() => setImageFailed(true)}
                    />
                  )}
                </div>
              </div>
            </article>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Resume;
