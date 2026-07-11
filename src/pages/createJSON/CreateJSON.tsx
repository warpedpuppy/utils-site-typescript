import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./CreateJSON.scss";
import CopyCodePicker from "./createJSONComponents/CopyCodePicker";
import {
  downloadExport,
  formatExport,
  gatherSelection,
  ExportLang,
} from "./createJSONUtils/createJSONUtils";
import { readSelection, writeSelection } from "./selectionStorage";

function persist(keys: string[]) {
  writeSelection(keys);
  // Kept for any other listeners (e.g. the nav selection badge).
  window.dispatchEvent(new CustomEvent("formulaSelectionChanged"));
}

function CreateJSON() {
  const [selected, setSelected] = useState<string[]>(readSelection);
  const [lang, setLang] = useState<ExportLang>("ts");
  const [copied, setCopied] = useState(false);

  const setSelection = (keys: string[]) => {
    setSelected(keys);
    persist(keys);
    setCopied(false);
  };

  const toggle = (key: string) => {
    setSelection(
      selected.includes(key)
        ? selected.filter((k) => k !== key)
        : [...selected, key],
    );
  };

  const selection = useMemo(() => gatherSelection(selected), [selected]);
  const code = useMemo(
    () => formatExport(lang, selected),
    [lang, selected],
  );

  const count = selection.entries.length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div id="create-json">
      <Helmet>
        <title>Copy Code — Utilspalooza</title>
        <meta name="description" content="Pick canvas animation functions and copy ready-to-use TypeScript or JavaScript — imports, interfaces, or a standalone file. No install, no library." />
        <link rel="canonical" href="https://utilspalooza.com/create-json" />
        <meta property="og:url" content="https://utilspalooza.com/create-json" />
        <meta property="og:title" content="Copy Code — Utilspalooza" />
      </Helmet>

      <div id="create-json-container">
        <header className="copy-code-header">
          <p>copy code</p>
          <h1>Build the exact file you need.</h1>
          <span>
            Check off the functions you want on the left. The right side assembles
            a clean, typed TypeScript (or plain JS) file on the fly — interfaces
            and helper dependencies pulled in automatically. Copy it or download
            it. No install, no library, just the code.
          </span>
        </header>

        <div className="copy-code__workspace">
          <CopyCodePicker selected={selected} onToggle={toggle} />

          <section className="copy-code__output" aria-label="Generated code">
            <div className="copy-code__actions">
              <span className="copy-code__count">
                {count} function{count !== 1 ? "s" : ""} selected
              </span>

              <div className="copy-code__lang" role="tablist" aria-label="Language">
                {(["ts", "js"] as ExportLang[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="tab"
                    aria-selected={lang === option}
                    className={lang === option ? "is-active" : ""}
                    onClick={() => setLang(option)}
                  >
                    {option === "ts" ? "TypeScript" : "JavaScript"}
                  </button>
                ))}
              </div>

              <div className="copy-code__action-buttons">
                <button
                  type="button"
                  className="btn-primary"
                  disabled={count === 0}
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={count === 0}
                  onClick={() => downloadExport(lang)}
                >
                  Download .{lang}
                </button>
                {count > 0 && (
                  <button
                    type="button"
                    className="btn-secondary copy-code__clear"
                    onClick={() => setSelection([])}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {count === 0 ? (
              <div className="copy-code__empty">
                <p className="copy-code__empty-title">Nothing selected yet.</p>
                <p>
                  Pick a function or two from the left — say <code>lerp</code> or{" "}
                  <code>circleCircle</code> — and the ready-to-paste code will
                  appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="copy-code__chips">
                  {selection.entries.map((entry) => (
                    <button
                      key={entry.key}
                      type="button"
                      className="copy-code__chip"
                      title={`Remove ${entry.title}`}
                      onClick={() => toggle(entry.key)}
                    >
                      {entry.title}
                      <span aria-hidden="true">×</span>
                    </button>
                  ))}
                </div>

                {(selection.interfaces.length > 0 ||
                  selection.dependencies.length > 0) && (
                  <div className="copy-code__included">
                    {selection.interfaces.length > 0 && (
                      <p>
                        <strong>Shared types:</strong>{" "}
                        {selection.interfaces.join(", ")}{" "}
                        <span className="copy-code__included-note">
                          — the data shapes your functions expect (
                          {lang === "ts"
                            ? "included below"
                            : "dropped in the JS output"}
                          ).
                        </span>
                      </p>
                    )}
                    {selection.dependencies.length > 0 && (
                      <p>
                        <strong>
                          {selection.dependencies.length} helper
                          {selection.dependencies.length !== 1 ? "s" : ""}
                        </strong>{" "}
                        <span className="copy-code__included-note">
                          pulled in automatically because your picks call them.
                        </span>
                      </p>
                    )}
                  </div>
                )}

                <pre className="copy-code__code">
                  <code>{code}</code>
                </pre>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default CreateJSON;
