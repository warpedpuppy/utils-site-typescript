import corePkg from "../packages/core/package.json";

/**
 * Single source for the public-facing package facts (version, license, links).
 * Version and license are read straight from packages/core/package.json so the
 * site can never claim a version that wasn't the one built against.
 */
export const CORE_PACKAGE_NAME = corePkg.name;
export const CORE_VERSION = corePkg.version;
export const CORE_LICENSE = corePkg.license;
export const GITHUB_URL =
  "https://github.com/warpedpuppy/utils-site-typescript";
export const NPM_URL = "https://www.npmjs.com/package/@utilspalooza/core";
