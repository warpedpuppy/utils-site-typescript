// All the URL-driven navigation state for /api: which tab is showing, the
// filter query, and the scroll choreography that keeps the Overview position
// when you dive into a function and come back. Extracted from ApiDocs.tsx so the
// page component is layout; this owns the useState/useRef/useEffect machinery.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CONCEPT_PREFIX } from "./apiModel";

// Concept map first: /api opens on "Explore by concept" (the grouped-by-idea
// map that covers every export), not the alphabetical reference. "reference,
// not first destination" — you browse by idea, then drill into Full reference
// when you already know the name.
export const TABS = [
  { id: "overview", label: "Explore by concept" },
  { id: "documentation", label: "Full reference" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

// The tab a bare /api URL lands on (and therefore the one that carries no ?tab
// param). Flipping this to "overview" is what makes the concept map the front door.
const DEFAULT_TAB: TabId = "overview";

const OVERVIEW_SCROLL_KEY = "api-docs:overview-scroll-y";

function isTabId(value: string | null): value is TabId {
  return TABS.some((tab) => tab.id === value);
}

function getTabFromSearch(search: string): TabId {
  const params = new URLSearchParams(search);
  const value = params.get("tab");
  if (isTabId(value)) return value;
  // A bare ?fn= deep link (no explicit tab) still lands on the reference so the
  // targeted function is shown, not hidden behind the concept map.
  if (params.get("fn")) return "documentation";
  return DEFAULT_TAB;
}

export interface ApiDocsNavigation {
  tab: TabId;
  query: string;
  pickFunction: (name: string, conceptId: string) => void;
  focusFunction: (name: string) => void;
  setTab: (nextTab: TabId) => void;
  setDocumentationQuery: (value: string) => void;
  jumpToConcept: (conceptId: string) => void;
}

export function useApiDocsNavigation(): ApiDocsNavigation {
  const navigate = useNavigate();
  const location = useLocation();
  const tab = getTabFromSearch(location.search);
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const lastTabRef = useRef<TabId | null>(null);
  const overviewScrollRef = useRef(0);
  const pendingDocTargetRef = useRef<string | null>(searchParams.get("fn"));
  const pendingOverviewConceptRef = useRef<string | null>(searchParams.get("concept"));

  const saveOverviewScroll = () => {
    overviewScrollRef.current = window.scrollY;
    sessionStorage.setItem(OVERVIEW_SCROLL_KEY, String(window.scrollY));
  };

  const restoreOverviewScroll = () => {
    const saved =
      overviewScrollRef.current ||
      Number(sessionStorage.getItem(OVERVIEW_SCROLL_KEY) ?? "0");
    window.scrollTo({ top: Number.isFinite(saved) ? saved : 0, behavior: "auto" });
  };

  const scrollConceptIntoView = (conceptId: string) => {
    document.getElementById(`${CONCEPT_PREFIX}${conceptId}`)?.scrollIntoView({
      block: "start",
    });
  };

  const updateSearch = (
    nextTab: TabId,
    nextQuery = "",
    nextFn?: string,
    nextConcept?: string,
    replace = false,
  ) => {
    const params = new URLSearchParams();
    if (nextTab !== DEFAULT_TAB) params.set("tab", nextTab);
    const trimmedQuery = nextQuery.trim();
    if (trimmedQuery) params.set("q", trimmedQuery);
    if (nextFn) params.set("fn", nextFn);
    if (nextConcept) params.set("concept", nextConcept);
    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace },
    );
  };

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    setQuery((current) => (current === nextQuery ? current : nextQuery));
    pendingDocTargetRef.current = searchParams.get("fn");
    pendingOverviewConceptRef.current = searchParams.get("concept");
  }, [searchParams]);

  useLayoutEffect(() => {
    const previousTab = lastTabRef.current;
    if (tab === previousTab) return;

    if (tab === "overview") {
      requestAnimationFrame(() => {
        const conceptId = pendingOverviewConceptRef.current;
        if (conceptId) {
          scrollConceptIntoView(conceptId);
        } else if (previousTab !== null) {
          restoreOverviewScroll();
        }
      });
    } else {
      requestAnimationFrame(() => {
        const target = pendingDocTargetRef.current;
        if (target) {
          document.getElementById(target)?.scrollIntoView({ block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      });
    }

    lastTabRef.current = tab;
  }, [tab]);

  // A concept chip on the Overview jumps to the reference, pre-filtered to that
  // export, and scrolls it into view once the Documentation tab has rendered.
  const pickFunction = (name: string, conceptId: string) => {
    saveOverviewScroll();
    setQuery(name);
    pendingDocTargetRef.current = name;
    pendingOverviewConceptRef.current = conceptId;
    updateSearch("documentation", name, name, conceptId);
  };

  const focusFunction = (name: string) => {
    setQuery(name);
    pendingDocTargetRef.current = name;
    updateSearch(
      "documentation",
      name,
      name,
      pendingOverviewConceptRef.current ?? undefined,
    );
  };

  const setTab = (nextTab: TabId) => {
    if (nextTab === tab) return;
    if (tab === "overview") saveOverviewScroll();
    if (nextTab === "overview") {
      pendingDocTargetRef.current = null;
      pendingOverviewConceptRef.current = null;
      updateSearch("overview");
      return;
    }
    updateSearch("documentation", query, undefined, pendingOverviewConceptRef.current ?? undefined);
  };

  const setDocumentationQuery = (value: string) => {
    setQuery(value);
    pendingDocTargetRef.current = null;
    updateSearch(
      "documentation",
      value,
      undefined,
      pendingOverviewConceptRef.current ?? undefined,
      true,
    );
  };

  const jumpToConcept = (conceptId: string) => {
    pendingDocTargetRef.current = null;
    pendingOverviewConceptRef.current = conceptId;
    updateSearch("overview", "", undefined, conceptId);
  };

  return {
    tab,
    query,
    pickFunction,
    focusFunction,
    setTab,
    setDocumentationQuery,
    jumpToConcept,
  };
}
