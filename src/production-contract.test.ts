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
