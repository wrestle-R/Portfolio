import React, { useState } from "react";
import { Download, ExternalLink, FileImage, FileText } from "lucide-react";
import Footer from "../components/Footer";
import StickerNavigation from "../components/StickerNavigation";

const resumePdf = "/Resume/Resume.pdf";
const resumeImage = "/Resume/Resume.jpg";

const Resume = () => {
  const [imageFailed, setImageFailed] = useState(false);

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
      <StickerNavigation />

      <main className="relative z-10 px-4 pb-12 pt-6 md:pb-16">
        <div className="mx-auto w-full max-w-4xl space-y-8">
          <section>
            <article
              className="resume-title-card rounded-xl border p-5 transition-colors duration-300 ease-in-out hover:bg-muted/50 md:p-6"
              style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
            >
              <div className="flex flex-col items-center gap-5">
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
              </div>

              <div className="resume-actions mt-5 flex flex-wrap gap-2">
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
                      width="1275"
                      height="1650"
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
