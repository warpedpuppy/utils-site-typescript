import { describe, it, expect } from "vitest";
// @ts-expect-error — plain .mjs build script, no type declarations.
import { extractApi } from "../../../packages/core/scripts/extract-api.mjs";
import committed from "./core-api.json";

/**
 * DOCUMENTATION COMPLETENESS GUARANTEE
 *
 * The API page's "Documentation" tab renders src/pages/api/core-api.json, which
 * is generated from the real @utilspalooza/core source by
 * packages/core/scripts/extract-api.mjs (run via `npm run docs`, also part of
 * the core package build).
 *
 * These tests make the docs self-policing so they can never silently fall
 * behind the exports:
 *
 *   1. Every exported FUNCTION must carry a JSDoc description AND an @example.
 *      Ted's chosen bar — add a function without docs and this goes red.
 *   2. Every exported const must carry a description.
 *   3. The committed core-api.json must match a fresh extraction, so editing a
 *      function without re-running `npm run docs` is caught here too.
 *
 * (Type/interface exports are documented on the page but not example-gated.)
 */

interface ApiEntry {
  name: string;
  kind: "function" | "const" | "type";
  module: string;
  signature: string;
  description: string;
  params: { name: string; text: string }[];
  returns: string;
  example: string;
}

const fresh = extractApi() as ApiEntry[];
const id = (e: ApiEntry) => `${e.module}:${e.name}`;

describe("core-api documentation completeness", () => {
  const functions = fresh.filter((e) => e.kind === "function");
  const consts = fresh.filter((e) => e.kind === "const");

  it("extracts a non-trivial number of exports", () => {
    expect(functions.length).toBeGreaterThan(50);
  });

  it.each(functions.map((e) => [id(e), e] as const))(
    "function %s has a description",
    (_label, entry) => {
      expect(entry.description.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(functions.map((e) => [id(e), e] as const))(
    "function %s has an @example",
    (_label, entry) => {
      expect(entry.example.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(consts.map((e) => [id(e), e] as const))(
    "const %s has a description",
    (_label, entry) => {
      expect(entry.description.trim().length).toBeGreaterThan(0);
    },
  );

  it("committed core-api.json is in sync with source (run `npm run docs`)", () => {
    expect(committed).toEqual(fresh);
  });
});
