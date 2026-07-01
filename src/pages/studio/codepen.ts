// ─── CodePen prefill helper ──────────────────────────────────────────────────
// Shared by the Audio Visualizer studio page and the "Tinker in CodePen" picker.
//
// CodePen's prefill API (https://blog.codepen.io/documentation/prefill/) wants a
// POST to /pen/define with a single `data` field holding a JSON blob.
//
// THE GOTCHA (this was the original bug): you must submit via a *native* submit
// button. Creating a form in JS and calling `form.submit()` targets a new tab,
// which the browser treats as a script-opened popup and silently blocks — the
// POST fires but no CodePen tab ever opens. A genuine click on a
// `<button type="submit">` is the form's default action and is never blocked.

export interface CodePenPayload {
  title: string;
  description?: string;
  html: string;
  css: string;
  js: string;
  editors?: string;
  // Semicolon-separated external script URLs CodePen loads before the JS pane
  // runs. Used by the quickstart pen to pull @utilspalooza/core from the CDN so
  // `Utilspalooza.ballBounce` is defined when the loop starts.
  js_external?: string;
}

const CODEPEN_ENDPOINT = "https://codepen.io/pen/define";

// Build a complete, ready-to-submit CodePen form as a real DOM element.
//
// Why a DOM element and not an innerHTML string: the payload is a big JSON blob
// that contains quotes, < and > (arrow functions, comparisons), and ampersands.
// Round-tripping that through an HTML attribute means getting the escaping
// exactly right; one missed character and CodePen can't parse the data and no
// tab opens. Setting `input.value` as a *property* skips HTML parsing entirely —
// the browser stores the string verbatim. Append this element somewhere and the
// visible control is a native submit button (never popup-blocked).
export function buildCodePenForm(
  payload: CodePenPayload,
  buttonLabel: string,
  buttonStyle = ""
): HTMLFormElement {
  const form = document.createElement("form");
  form.action = CODEPEN_ENDPOINT;
  form.method = "POST";
  form.target = "_blank";
  form.style.cssText = "margin:0;display:inline-flex";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "data";
  input.value = JSON.stringify(payload); // property assignment — no escaping needed

  const button = document.createElement("button");
  button.type = "submit";
  button.style.cssText = buttonStyle;
  button.textContent = buttonLabel;

  form.appendChild(input);
  form.appendChild(button);
  return form;
}

export { CODEPEN_ENDPOINT };
