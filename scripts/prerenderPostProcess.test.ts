import { describe, expect, it } from "vitest";
// @ts-expect-error — plain .mjs helper, no type declarations by design.
import { ORIGIN, postProcess } from "./prerenderPostProcess.mjs";

// Regression guard for the 2026-07-11 production incident: the prerenderer
// snapshots each route while serving from its local preview origin
// (http://127.0.0.1:4179), and Vite's router injects <link rel="modulepreload">
// tags resolved against that origin. Those absolute localhost URLs got frozen
// into the deployed static HTML, so every real visitor's browser tried to fetch
// assets from THEIR OWN machine's localhost — tripping Chrome's Local Network
// Access prompt ("utilspalooza.com wants to access other apps and services on
// this device"). postProcess() must strip the preview origin from every route.

describe("prerender postProcess strips the preview origin (Local Network Access regression)", () => {
  it("rewrites absolute preview-origin modulepreloads to root-relative", () => {
    const html = [
      "<head>",
      `<link rel="modulepreload" as="script" href="${ORIGIN}/assets/Home-abc.js">`,
      `<link rel="modulepreload" as="script" href="${ORIGIN}/assets/CopyInstall-def.js">`,
      "</head>",
    ].join("\n");

    const out = postProcess(html, "/");

    expect(out).not.toContain(ORIGIN);
    expect(out).not.toContain("127.0.0.1");
    expect(out).toContain('href="/assets/Home-abc.js"');
    expect(out).toContain('href="/assets/CopyInstall-def.js"');
  });

  it("strips the origin wherever it appears, not just in <link> hrefs", () => {
    const html = `<head><script src="${ORIGIN}/assets/index.js"></script></head>`;
    const out = postProcess(html, "/examples");
    expect(out).not.toContain("127.0.0.1");
    expect(out).toContain('src="/assets/index.js"');
  });

  it("leaves the production origin untouched", () => {
    const html =
      '<head><link rel="canonical" href="https://utilspalooza.com/api" data-rh="true"></head>';
    const out = postProcess(html, "/api");
    expect(out).toContain('href="https://utilspalooza.com/api"');
  });

  it("still appends the per-route prerender marker", () => {
    const out = postProcess("<head></head>", "/studio");
    expect(out).toContain("<!-- prerendered /studio -->");
  });
});
