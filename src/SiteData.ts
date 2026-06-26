import animationManifest from "./animationManifest";

// Compatibility export for older consumers/tests. The runtime registry is now
// the lightweight manifest; animation classes load only through entry.load().
export default animationManifest;
