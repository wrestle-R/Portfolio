import React from "react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { buildSubdomainUrl } from "../lib/domain-utils";

const latestBlogPost = {
  title: "20 days before 21",
  publishedAt: "2026-03-02",
  excerpt:
    "In about twenty days I turn 21, which apparently means I will be technically allowed to legally drink, get married, and sort of be responsible for myself.",
  slug: "20-days-before-21",
};

const LatestBlog = () => {
  const titleText = "Latest Blog";
  const blogBaseUrl = buildSubdomainUrl("blogs");
  const blogPostUrl = `${blogBaseUrl}/blog/${latestBlogPost.slug}/`;

  const publishedDate = new Date(latestBlogPost.publishedAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <section
      className="relative w-full px-4 pt-8 md:pt-10"
      id="latest-blog"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <div className="mb-3 md:mb-4 pb-4 md:pb-6 text-left pl-2">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl font-bold"
            duration={1.5}
            filter={true}
          />
        </div>

        <a
          href={blogPostUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl border p-4 md:p-6 w-full transition-colors duration-300 ease-in-out hover:bg-muted/50"
          style={{
            backgroundColor: "oklch(var(--background))",
            borderColor: "oklch(var(--border))",
          }}
        >
          <article className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h3
                className="text-xl md:text-2xl font-semibold leading-tight"
                style={{ color: "oklch(var(--foreground))" }}
              >
                {latestBlogPost.title}
              </h3>
              <span
                className="text-xs md:text-sm font-mono border px-3 py-1.5 rounded-full"
                style={{
                  borderColor: "oklch(var(--border))",
                  color: "oklch(var(--muted-foreground))",
                }}
              >
                {publishedDate}
              </span>
            </div>

            <p
              className="text-sm md:text-base leading-relaxed overflow-hidden"
              style={{
                color: "oklch(var(--muted-foreground))",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {latestBlogPost.excerpt}.......
            </p>
          </article>
        </a>
      </div>
    </section>
  );
};

export default LatestBlog;
