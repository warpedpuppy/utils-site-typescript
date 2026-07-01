import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { buildCodePenForm } from "../studio/codepen";
import CopyInstall from "../../components/CopyInstall/CopyInstall";
import {
  QUICKSTART_PEN,
  QUICKSTART_SINGLE_FILE,
  UTILSPALOOZA_CDN,
} from "./quickstartPen";
import "./Quickstart.scss";

function Quickstart() {
  const penMountRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Reuse the studio's CodePen helper: it returns a real <form> with a native
  // submit button, which is the only thing CodePen's prefill API doesn't get
  // popup-blocked on.
  useEffect(() => {
    const mount = penMountRef.current;
    if (!mount) return;
    const form = buildCodePenForm(QUICKSTART_PEN, "open it live in CodePen ↗");
    mount.appendChild(form);
    return () => {
      mount.removeChild(form);
    };
  }, []);

  const copyFile = async () => {
    try {
      await navigator.clipboard.writeText(QUICKSTART_SINGLE_FILE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — the code is still selectable in the block */
    }
  };

  return (
    <div id="quickstart-wrapper">
      <Helmet>
        <title>Start here — Utilspalooza</title>
        <meta
          name="description"
          content="New to canvas animation? Start from the smallest complete file: one HTML page that loads @utilspalooza/core and bounces a ball. Copy it, save it, open it — no build step."
        />
        <link rel="canonical" href="https://utilspalooza.com/quickstart" />
        <meta property="og:url" content="https://utilspalooza.com/quickstart" />
        <meta property="og:title" content="Start here — Utilspalooza" />
      </Helmet>

      <div id="quickstart-wrapper--inner">
        <h2>Don't know where to begin? Start here.</h2>
        <p>
          Every example on this site is a function you call inside an animation
          loop. If you've never wired one up before, the gap between{" "}
          <em>seeing</em> a bouncing ball and <em>running</em> one in your own
          page can feel bigger than it is. It isn't. Below is the{" "}
          <strong>smallest complete file</strong> that does it — the entire
          thing, nothing hidden.
        </p>

        <h3>The whole file</h3>
        <p>
          Copy this into a file called <code>index.html</code>, save it, and
          double-click it. That's the entire build step. There is no bundler, no{" "}
          <code>node_modules</code>, no framework.
        </p>

        <div className="quickstart-codeblock">
          <button className="quickstart-copy" onClick={copyFile}>
            {copied ? "copied ✓" : "copy"}
          </button>
          <pre>
            <code>{QUICKSTART_SINGLE_FILE}</code>
          </pre>
        </div>

        <div className="quickstart-pen" ref={penMountRef} />

        <h3>What each part is doing</h3>
        <ol className="quickstart-anatomy">
          <li>
            <strong>The canvas.</strong> One <code>&lt;canvas&gt;</code> element
            — the rectangle you draw into. Its <code>width</code> and{" "}
            <code>height</code> are the drawing resolution.
          </li>
          <li>
            <strong>The library.</strong> The{" "}
            <code>&lt;script src="{UTILSPALOOZA_CDN}"&gt;</code> line pulls in
            all of Utilspalooza from a CDN and hangs it on a global called{" "}
            <code>Utilspalooza</code>. That's the only dependency.
          </li>
          <li>
            <strong>The loop.</strong>{" "}
            <code>requestAnimationFrame</code> calls <code>frame()</code> about
            60 times a second. Each frame: <code>ballBounce</code> nudges the
            ball one physics step (it edits the ball's position and velocity in
            place), then you clear the canvas and draw the ball at its new spot.
            That's the shape of <em>every</em> animation here.
          </li>
        </ol>

        <h3>Ready for a real project?</h3>
        <p>
          The CDN tag above is the zero-setup path. When you're working in a
          bundled project (Vite, Next, etc.), install it instead:
        </p>
        <div className="quickstart-install">
          <CopyInstall />
        </div>
        <p>
          …then <code>import {"{ ballBounce }"} from "@utilspalooza/core"</code>{" "}
          and use the exact same loop. Browse the{" "}
          <Link to="/examples">examples</Link> for more functions, or the{" "}
          <Link to="/api">API reference</Link> to see every one with its
          signature and a live demo.
        </p>
      </div>
    </div>
  );
}

export default Quickstart;
