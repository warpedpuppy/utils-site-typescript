import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { preview, type PreviewServer } from "vite";
import { chromium, type Browser, type Page } from "playwright";
import { ALL_RECORDS } from "./registry";
import { runPen } from "./pages/studio/codepenRuntimeTestHarness";
import { EXPORT_CATALOG } from "./pages/createJSON/exportCatalog";

// Production-bundle contract test.
//
// The ordinary CodePen runtime test (studio-codepen-runtime.test.ts) reads
// payloads straight from source, so it can stay green while the *minified*
// production bundle ships broken payloads (identifier renaming, dropped
// declarations). This test closes that gap: it serves the built `dist/`
// through `vite preview`, drives the real /studio page in headless Chromium,
// reads each pen's payload out of the CodePen form exactly as CodePen would
// receive it, and boots that JavaScript in the shared VM harness.
//
// It is deliberately excluded from the plain `npm test` sweep (see the
// `--exclude` flag on the root `test` script) because it requires a fresh
// production build. Run it via `npm run test:production-contract`.

const DIST_INDEX = fileURLToPath(new URL("../dist/index.html", import.meta.url));
const PREVIEW_ORIGIN = "http://127.0.0.1:4181";

const EXPECTED_PEN_KEYS = ALL_RECORDS.filter((r) => r.pen === "canonical-vm-tested").map(
  (r) => r.slug
);

let server: PreviewServer | undefined;
let browser: Browser | undefined;
let page: Page | undefined;

beforeAll(async () => {
  if (!existsSync(DIST_INDEX)) {
    throw new Error(
      "dist/index.html is missing — this test exercises the minified production bundle. " +
        "Run `npm run test:production-contract` (which builds first) instead of invoking vitest directly."
    );
  }

  server = await preview({
    preview: { host: "127.0.0.1", port: 4181, strictPort: true },
  });
  browser = await chromium.launch();
  page = await browser.newPage();

  // Lifecycle instrumentation for the SPA leak test (WP4): count active
  // window resize listeners and live intervals/timeouts from before any page
  // script runs.
  await page.addInitScript(() => {
    const counts = {
      resizeListeners: 0,
      activeIntervals: 0,
      activeTimeouts: 0,
    };
    (window as unknown as Record<string, unknown>).__leakCounts = counts;

    const addEL = window.addEventListener.bind(window);
    const removeEL = window.removeEventListener.bind(window);
    window.addEventListener = ((type: string, ...rest: unknown[]) => {
      if (type === "resize") counts.resizeListeners++;
      return (addEL as (...a: unknown[]) => unknown)(type, ...rest);
    }) as typeof window.addEventListener;
    window.removeEventListener = ((type: string, ...rest: unknown[]) => {
      if (type === "resize") counts.resizeListeners--;
      return (removeEL as (...a: unknown[]) => unknown)(type, ...rest);
    }) as typeof window.removeEventListener;

    const origSetInterval = window.setInterval.bind(window);
    const origClearInterval = window.clearInterval.bind(window);
    const liveIntervals = new Set<number>();
    window.setInterval = ((...args: unknown[]) => {
      const id = (origSetInterval as (...a: unknown[]) => number)(...args);
      liveIntervals.add(id);
      counts.activeIntervals = liveIntervals.size;
      return id;
    }) as typeof window.setInterval;
    window.clearInterval = ((id?: number) => {
      if (id !== undefined) liveIntervals.delete(id);
      counts.activeIntervals = liveIntervals.size;
      return origClearInterval(id);
    }) as typeof window.clearInterval;

    const origSetTimeout = window.setTimeout.bind(window);
    const origClearTimeout = window.clearTimeout.bind(window);
    const liveTimeouts = new Set<number>();
    window.setTimeout = ((handler: TimerHandler, ...rest: unknown[]) => {
      const wrapped =
        typeof handler === "function"
          ? (...handlerArgs: unknown[]) => {
              liveTimeouts.delete(id);
              counts.activeTimeouts = liveTimeouts.size;
              return (handler as (...a: unknown[]) => unknown)(...handlerArgs);
            }
          : handler;
      const id = (origSetTimeout as (...a: unknown[]) => number)(
        wrapped,
        ...rest
      );
      liveTimeouts.add(id);
      counts.activeTimeouts = liveTimeouts.size;
      return id;
    }) as typeof window.setTimeout;
    window.clearTimeout = ((id?: number) => {
      if (id !== undefined) liveTimeouts.delete(id);
      counts.activeTimeouts = liveTimeouts.size;
      return origClearTimeout(id);
    }) as typeof window.clearTimeout;
  });
}, 60_000);

afterAll(async () => {
  await page?.close().catch(() => {});
  await browser?.close().catch(() => {});
  if (server) {
    await new Promise<void>((resolve, reject) => {
      server!.httpServer.close((err) => (err ? reject(err) : resolve()));
    });
  }
});

describe("production dist/ serves working CodePen payloads", () => {
  it(
    "boots every canonical-vm-tested pen from the minified bundle",
    async () => {
      if (!page) throw new Error("browser page did not start");

      await page.goto(`${PREVIEW_ORIGIN}/studio`, { waitUntil: "networkidle" });
      await page.waitForSelector(".codepen-picker-select");

      const availableKeys = new Set(
        await page.$$eval(".codepen-picker-select option", (options) =>
          options.map((o) => (o as HTMLOptionElement).value)
        )
      );

      const failures: Array<{ key: string; message: string }> = [];

      for (const key of EXPECTED_PEN_KEYS) {
        if (!availableKeys.has(key)) {
          failures.push({ key, message: "missing <option> in .codepen-picker-select" });
          continue;
        }

        try {
          await page.selectOption(".codepen-picker-select", key);
          // The select is a controlled component: once its value reflects the
          // chosen key, the same React commit has updated the hidden payload.
          await page.waitForFunction(
            (expected) =>
              document.querySelector<HTMLSelectElement>(".codepen-picker-select")?.value ===
              expected,
            key
          );

          const raw = await page.inputValue('.codepen-picker-form input[name="data"]');
          const payload = JSON.parse(raw) as { js?: string };
          if (typeof payload.js !== "string" || payload.js.length === 0) {
            throw new Error("payload JSON has no js field");
          }
          runPen(payload.js);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push({ key, message });
        }
      }

      expect(failures).toEqual([]);
    },
    180_000
  );
});

describe("production dist/ serves a working Copy Code page", () => {
  function parseFailure(code: string, lang: "ts" | "js"): string | null {
    const result = ts.transpileModule(code, {
      reportDiagnostics: true,
      fileName: lang === "ts" ? "snippet.ts" : "snippet.js",
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        allowJs: true,
      },
    });
    const first = (result.diagnostics ?? [])[0];
    return first ? ts.flattenDiagnosticMessageText(first.messageText, " ") : null;
  }

  it(
    "labels are canonical catalog keys and every selection parses in both languages",
    async () => {
      if (!page) throw new Error("browser page did not start");

      await page.goto(`${PREVIEW_ORIGIN}/create-json`, { waitUntil: "networkidle" });
      await page.waitForSelector(".copy-code__item");

      // Start from a clean selection regardless of stored state.
      await page.evaluate(() => {
        localStorage.setItem("functions", "");
        localStorage.setItem("functionsSchemaVersion", "2");
      });
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForSelector(".copy-code__item");

      // Labels must be the canonical API names, not minified identifiers.
      const labels = await page.$$eval(".copy-code__item-title", (els) =>
        els.map((e) => e.textContent ?? "")
      );
      const catalogKeys = EXPORT_CATALOG.map((e) => e.key);
      expect([...labels].sort()).toEqual([...catalogKeys].sort());

      const readOutput = async (lang: "ts" | "js") => {
        await page!
          .getByRole("tab", { name: lang === "ts" ? "TypeScript" : "JavaScript" })
          .click();
        return page!.textContent(".copy-code__code code");
      };

      const failures: Array<{ key: string; lang: string; message: string }> = [];
      const items = page.locator(".copy-code__item input[type=checkbox]");
      const count = await items.count();
      expect(count).toBe(catalogKeys.length);

      for (let i = 0; i < count; i++) {
        const key = labels[i];
        await items.nth(i).check();
        for (const lang of ["ts", "js"] as const) {
          const code = (await readOutput(lang)) ?? "";
          if (code.trim() === "") {
            failures.push({ key, lang, message: "empty output" });
            continue;
          }
          const message = parseFailure(code, lang);
          if (message) failures.push({ key, lang, message });
        }
        await items.nth(i).uncheck();
      }
      expect(failures).toEqual([]);

      // Select everything and parse both combined outputs.
      for (let i = 0; i < count; i++) await items.nth(i).check();
      for (const lang of ["ts", "js"] as const) {
        const code = (await readOutput(lang)) ?? "";
        expect(code.trim(), `combined ${lang} output is non-empty`).not.toBe("");
        expect(
          parseFailure(code, lang),
          `combined ${lang} output parses`
        ).toBeNull();
      }
    },
    600_000
  );
});

describe("SPA navigation releases animation resources (WP4)", () => {
  interface LeakCounts {
    resizeListeners: number;
    activeIntervals: number;
    activeTimeouts: number;
  }

  it(
    "resize listeners and timers return to baseline across animation transitions",
    async () => {
      if (!page) throw new Error("browser page did not start");

      const readCounts = async (): Promise<LeakCounts> => {
        // Let any teardown timeouts fire before sampling.
        await page!.waitForTimeout(250);
        return page!.evaluate(
          () =>
            (window as unknown as { __leakCounts: LeakCounts }).__leakCounts
        );
      };

      // /create-json renders no canvas, so it is a clean pre-animation state.
      await page.goto(`${PREVIEW_ORIGIN}/create-json`, {
        waitUntil: "networkidle",
      });
      const baseline = await readCounts();

      // Enter the SPA's Examples section by clicking, so every transition
      // below is a client-side route change (no full reload, no counter reset).
      await page.getByRole("link", { name: "examples" }).click();
      await page.waitForSelector(".example-checklist-link");

      const visit = async (title: string) => {
        // Categories are collapsed by default; the sidebar filter auto-opens
        // whichever category matches.
        await page!.fill(".checklist-filter input", title);
        await page!
          .locator(".example-checklist-link", { hasText: title })
          .first()
          .click();
        await page!.waitForSelector(
          "#primary-canvas--content--canvas-container canvas"
        );
        await page!.fill(".checklist-filter input", "");
        return readCounts();
      };

      const sequence: Array<[string, string]> = [
        ["flow-field", "Perlin noise flow field"],
        ["ball-bounce-1", "ball bounce"],
        ["wave-interference", "Wave interference"],
        ["ball-bounce-2", "ball bounce"],
        ["move-to-destination", "move object to changing point"],
        ["ball-bounce-3", "ball bounce"],
      ];
      const snapshots: Record<string, LeakCounts> = {};
      for (const [label, title] of sequence) {
        snapshots[label] = await visit(title);
      }

      // The same animation must cost the same resources every visit — growth
      // between identical states is a leak.
      expect(snapshots["ball-bounce-2"]).toEqual(snapshots["ball-bounce-1"]);
      expect(snapshots["ball-bounce-3"]).toEqual(snapshots["ball-bounce-1"]);

      // MoveToDestination's 2s interval must not survive into the next page.
      expect(snapshots["ball-bounce-3"].activeIntervals).toBe(
        snapshots["ball-bounce-1"].activeIntervals
      );

      // Leaving the Examples section entirely returns to the pre-animation
      // baseline. Short-lived UI timeouts may still be pending right after
      // the transition — give them up to 5s to fire; a leaked interval or
      // listener never drains and still fails.
      await page.getByRole("link", { name: "copy code" }).click();
      await page.waitForURL("**/create-json");
      let finalCounts = await readCounts();
      for (let i = 0; i < 20 && finalCounts.activeTimeouts > baseline.activeTimeouts; i++) {
        finalCounts = await readCounts();
      }
      // A leak is GROWTH past baseline, so the invariant is "no counter exceeds
      // baseline." Resize listeners and intervals are animation-owned and
      // deterministic — those must return to baseline exactly (this is what
      // catches the resize-listener and MoveToDestination-interval leaks WP4
      // fixed). activeTimeouts also includes non-animation, one-shot app timers
      // (analytics/fonts/React) that may be pending when the baseline is sampled
      // on a cold first load but drained by the warm final sample — a strict
      // `toEqual` there produces a false failure (final 0 < baseline 1). Assert
      // `<=` so a genuine timeout leak (final > baseline) still fails while a
      // drained transient does not.
      expect(finalCounts.resizeListeners).toBe(baseline.resizeListeners);
      expect(finalCounts.activeIntervals).toBe(baseline.activeIntervals);
      expect(finalCounts.activeTimeouts).toBeLessThanOrEqual(
        baseline.activeTimeouts
      );
    },
    120_000
  );
});

describe("no horizontal overflow on /api docs at 390px (WP5)", () => {
  const ROUTES = [
    "/api?tab=documentation&fn=mapRange",
    "/api?tab=documentation&fn=circleCircle",
  ];

  it(
    "mapRange and circleCircle issue pages fit a 390px viewport",
    async () => {
      if (!browser) throw new Error("browser did not start");
      const mobile = await browser.newPage({
        viewport: { width: 390, height: 844 },
      });
      const failures: Array<{ route: string; scrollWidth: number; clientWidth: number }> = [];
      try {
        for (const route of ROUTES) {
          await mobile.goto(`${PREVIEW_ORIGIN}${route}`, {
            waitUntil: "networkidle",
          });
          // Let the mini-demos mount and size themselves.
          await mobile.waitForTimeout(500);
          const { scrollWidth, clientWidth } = await mobile.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
          }));
          if (scrollWidth > clientWidth) {
            failures.push({ route, scrollWidth, clientWidth });
          }
        }
      } finally {
        await mobile.close();
      }
      expect(failures).toEqual([]);
    },
    120_000
  );
});
