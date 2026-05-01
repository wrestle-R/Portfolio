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
  const blogHomeUrl = `${blogBaseUrl}/blog`;

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

        <article
          className="rounded-[2rem] border p-2 md:p-3 w-full"
          style={{
            backgroundColor: "oklch(var(--muted) / 0.38)",
            borderColor: "oklch(var(--border))",
          }}
        >
          <div
            className="rounded-2xl border p-4 md:p-5 w-full flex flex-col gap-4"
            style={{
              borderColor: "oklch(var(--border))",
              backgroundColor: "oklch(var(--background) / 0.65)",
            }}
          >
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
              className="text-sm md:text-base leading-relaxed"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              {latestBlogPost.excerpt}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={blogPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-opacity hover:opacity-85"
                style={{
                  backgroundColor: "oklch(var(--primary))",
                  color: "oklch(var(--primary-foreground))",
                }}
              >
                Read Post
              </a>
              <a
                href={blogHomeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-sm font-medium tracking-wide border transition-colors"
                style={{
                  borderColor: "oklch(var(--border))",
                  color: "oklch(var(--foreground))",
                  backgroundColor: "oklch(var(--background) / 0.35)",
                }}
              >
                View All Blogs
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default LatestBlog;
