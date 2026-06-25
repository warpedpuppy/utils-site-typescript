# @utilspalooza/effects

Small Canvas 2D effects that are easy to mount on a site.

```ts
import { mountGlitter } from "@utilspalooza/effects";

const effect = mountGlitter("#hero", {
  density: 0.8,
  interactive: true,
});

effect.destroy();
```

Every mount function accepts a canvas, an element, or a selector string and
returns the same control handle:

```ts
handle.pause();
handle.resume();
handle.resize();
handle.destroy();
```

Available effects:

- `mountGlitter`
- `mountPrettyRing`
- `mountSparklies`
- `mountKlimt`

These effects belong outside `@utilspalooza/core` because they create canvases,
listen for resize/pointer events, and run animation loops. The core package stays
pure math.
