import { useState } from "react";
import "./CopyInstall.scss";

/**
 * The click-to-copy install box shown on the home page and /api. A single
 * component so the two are always identical: the command text sits on the left,
 * a delineated "copy" button on the right copies it to the clipboard and flashes
 * a "copied ✓" confirmation.
 */
export default function CopyInstall({
  command = "npm i @utilspalooza/core",
}: {
  command?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  return (
    <div className="copy-install">
      <code className="copy-install__command">{command}</code>
      <button
        type="button"
        className="copy-install__button"
        onClick={copy}
        aria-label={`Copy "${command}" to the clipboard`}
      >
        {copied ? "copied ✓" : "copy"}
      </button>
    </div>
  );
}
