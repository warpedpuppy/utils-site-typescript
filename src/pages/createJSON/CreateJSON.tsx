import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "./CreateJSON.scss";
import { useParams } from "react-router-dom";
import CreateJSONTabs from "./createJSONComponents/createJSONTabs";
import JSONContent from "./createJSONComponents/JSONContent";

import CreateChecklists from "../../services/CreateChecklists";
import { InterfaceMap } from "../../types/shapes";
import SiteData from "../../siteData/SiteData";
import { downloadTsExport, downloadJsExport, INTERFACE_ORDER } from "./createJSONUtils/createJSONUtils";

function getSelectionCount(): number {
  const raw = localStorage.getItem("functions");
  return raw ? raw.split(",").filter(Boolean).length : 0;
}

function getSelectedInterfaceNames(): string[] {
  const selected = (localStorage.getItem("functions") ?? "").split(",").filter(Boolean);
  const names = new Set<string>();
  Object.values(SiteData).forEach((objects) => {
    Object.entries(objects).forEach(([key, value]) => {
      if (selected.includes(key)) {
        (value.f.interfaces ?? []).forEach((iface: string) => {
          names.add(iface);
          if (iface === "Ball" || iface === "Rectangle") names.add("ShapeInMotion");
          if (iface === "Polygon") names.add("Vector");
          if (iface === "Line" || iface === "Triangle") names.add("Point");
        });
      }
    });
  });
  return INTERFACE_ORDER.filter((name) => names.has(name));
}

function CreateJSON() {
  const [tabBody, setTabBody] = useState<number>(0);
  const [selectionCount, setSelectionCount] = useState<number>(getSelectionCount);
  const [selectedInterfaces, setSelectedInterfaces] = useState<string[]>(getSelectedInterfaceNames);
  const { createChecklist } = CreateChecklists();
  const { tab } = useParams<string>();

  useEffect(() => {
    if (tab) setTabBody(+tab);
  }, [tab]);

  useEffect(() => {
    function handleSelectionChange() {
      setSelectionCount(getSelectionCount());
      const ifaces = getSelectedInterfaceNames();
      setSelectedInterfaces(ifaces);
      if (ifaces.length === 0) setTabBody((t) => (t === 2 ? 0 : t));
    }
    window.addEventListener("formulaSelectionChanged", handleSelectionChange);
    return () => window.removeEventListener("formulaSelectionChanged", handleSelectionChange);
  }, []);

  let checklist = createChecklist("create-json-page-checklist");

  function copyToClipboard(str: string) {
    let json = document.querySelector(str);
    if (json) {
      navigator.clipboard.writeText(json.textContent || "");
    }
  }

  return (
    <div id="create-json">
      <Helmet>
        <title>Build Your Utils File — Utilspalooza</title>
        <meta name="description" content="Select the canvas animation formulas you need and download a ready-to-use TypeScript or JavaScript file. No build step, no dependencies." />
        <link rel="canonical" href="https://utilspalooza.com/create-json" />
        <meta property="og:url" content="https://utilspalooza.com/create-json" />
        <meta property="og:title" content="Build Your Utils File — Utilspalooza" />
      </Helmet>
      <div id="create-json-container">
        {selectionCount > 0 && (
          <div id="download-bar">
            <span id="download-bar-count">{selectionCount} formula{selectionCount !== 1 ? "s" : ""} selected</span>
            <button className="btn btn-primary" onClick={downloadTsExport}>
              download .ts file
            </button>
            <button className="btn btn-secondary" onClick={downloadJsExport}>
              download .js file
            </button>
          </div>
        )}
        <CreateJSONTabs setTabBody={setTabBody} tabBody={tabBody} hasInterfaces={selectedInterfaces.length > 0} />
        <div className={`tab-content ${tabBody === 0 ? "active" : ""}`}>
          {checklist}
        </div>
        <div className={`tab-content ${tabBody === 1 ? "active" : ""}`}>
          <button
            className="btn btn-primary"
            onClick={() => copyToClipboard(".functions-pre")}
          >
            copy to clipboard
          </button>
          <JSONContent />
        </div>
        {selectedInterfaces.length > 0 && (
          <div className={`tab-content ${tabBody === 2 ? "active" : ""}`}>
            <button
              className="btn btn-primary"
              onClick={() => copyToClipboard(".shapes-pre")}
            >
              copy interfaces to clipboard
            </button>
            <pre className="shapes-pre">
              {selectedInterfaces.map((name) => `export ${InterfaceMap[name]}`).join("\n\n")}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateJSON;
