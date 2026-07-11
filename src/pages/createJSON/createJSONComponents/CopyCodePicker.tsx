import { useMemo, useState } from "react";
import {
  EXPORT_CATALOG,
  EXPORT_GROUP_ORDER,
  ExportCatalogEntry,
} from "../exportCatalog";

interface PickerGroup {
  category: string;
  items: ExportCatalogEntry[];
}

// Function-grained picker over the generated export catalog: every copyable
// core export (all 18 easings included) is its own checkbox, labelled with
// its canonical API name. Groups mirror the /api concept map.
function buildGroups(): PickerGroup[] {
  return EXPORT_GROUP_ORDER.map((category) => ({
    category,
    items: EXPORT_CATALOG.filter((entry) => entry.group === category),
  })).filter((group) => group.items.length > 0);
}

export default function CopyCodePicker({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (key: string) => void;
}) {
  const [query, setQuery] = useState("");
  const groups = useMemo(buildGroups, []);

  const q = query.trim().toLowerCase();
  const filtered = groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          !q ||
          item.key.toLowerCase().includes(q) ||
          group.category.toLowerCase().includes(q),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="copy-code__picker">
      <label className="copy-code__search">
        <span className="copy-code__search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          placeholder="Search functions…"
          aria-label="Search functions"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <div className="copy-code__groups">
        {filtered.length === 0 && (
          <p className="copy-code__no-matches">
            No functions match “{query.trim()}”.
          </p>
        )}
        {filtered.map((group) => (
          <section className="copy-code__group" key={group.category}>
            <h3 className="copy-code__group-title">{group.category}</h3>
            <div className="copy-code__group-items">
              {group.items.map((item) => {
                const isChecked = selected.includes(item.key);
                return (
                  <label
                    key={item.key}
                    className={
                      isChecked
                        ? "copy-code__item is-checked"
                        : "copy-code__item"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggle(item.key)}
                    />
                    <span className="copy-code__item-title">{item.title}</span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
