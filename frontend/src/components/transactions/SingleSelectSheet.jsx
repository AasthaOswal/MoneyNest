import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

const SingleSelectSheet = ({
  label,
  title,
  options = [],
  selectedId = null,
  onChange,
  placeholder = "Select item",
  emptyText = "No items found.",
  required = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (open) {
      setTempSelected(selectedId);
      setSearch("");
      setShowOptions(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, selectedId]);

  const selectedItem = useMemo(() => {
    return options.find((item) => item._id === selectedId);
  }, [options, selectedId]);

  const tempSelectedItem = useMemo(() => {
    return options.find((item) => item._id === tempSelected);
  }, [options, tempSelected]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = q
      ? options.filter((item) => item.name.toLowerCase().includes(q))
      : options;

    return [
      ...list.filter((item) => item._id === tempSelected),
      ...list.filter((item) => item._id !== tempSelected),
    ];
  }, [options, search, tempSelected]);

  const selectItem = (id) => {
    setTempSelected(id);
  };

  const clearSelection = () => {
    onChange(null);
  };

//   console.log("selectedId", selectedId);

// console.log(
//   "selectedItem",
//   options.find(item => item._id === selectedId)
// );

  const buttonText = selectedItem?.name || placeholder;

  return (
    <div>
      <label className="block text-md font-semibold text-muted mb-1">
        {label}
        {required && <span className="text-expense"> *</span>}
      </label>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-x-6 gap-y-3  rounded-xl border border-border bg-input-bg p-2.5 text-left text-sm text-text shadow-sm transition-all hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary hover:cursor-pointer "
      >
        <span className={!selectedItem ? "text-muted" : "text-text"}>
          {buttonText}
        </span>

        <ChevronDown size={16} className="text-muted shrink-0" />
      </button>

      {selectedItem && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-surface px-3 py-1 text-xs font-medium text-primary">
            {selectedItem.name}

            <button
              type="button"
              onClick={clearSelection}
              className="text-current/80 hover:text-current"
              aria-label={`Remove ${selectedItem.name}`}
            >
              ✕
            </button>
          </span>
        </div>
      )}

      {/* <p className="mt-2 text-xs text-muted">{placeholder}</p> */}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="mx-auto flex h-full w-full flex-col bg-surface md:h-full md:max-w-4xl md:rounded-none">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div>
                <h3 className="text-lg font-semibold text-text">{title}</h3>

                <p className="text-xs text-muted">
                  Search and select one item
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors hover:bg-bg"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-border px-4 py-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setShowOptions(true);
                    }
                  }}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowOptions(true)}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Search
                </button>
              </div>

              <p className="mt-2 text-xs text-muted">
                Click Search to load {label.toLowerCase()}.
              </p>
            </div>

            {/* Selected */}
            <div className="border-b border-border px-4 py-3">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Selected
              </div>

              {!tempSelectedItem ? (
                <p className="text-sm text-muted">No item selected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-surface px-3 py-1 text-xs font-medium text-primary">
                    {tempSelectedItem.name}

                    <button
                      type="button"
                      onClick={() => setTempSelected(null)}
                      className="text-primary/80 hover:text-primary"
                      aria-label={`Remove ${tempSelectedItem.name}`}
                    >
                      ✕
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {!showOptions ? (
                <div className="rounded-xl border border-border bg-bg px-4 py-4 text-sm text-muted">
                  Click <span className="font-medium text-primary">Search</span>{" "}
                  to show available {label.toLowerCase()}.
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="rounded-xl border border-border bg-bg px-4 py-4 text-sm text-muted">
                  {emptyText}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredOptions.map((item) => {
                    const checked = tempSelected === item._id;

                    return (
                      <label
                        key={item._id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                          checked
                            ? "border-primary bg-surface"
                            : "border-border bg-surface hover:bg-bg"
                        }`}
                      >
                        <input
                          type="radio"
                          name="single-select"
                          checked={checked}
                          onChange={() => selectItem(item._id)}
                          className="h-4 w-4 accent-primary"
                        />

                        <span
                          className={`flex-1 text-sm ${
                            checked ? "text-primary" : "text-text"
                          }`}
                        >
                          {item.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl border border-border bg-bg px-4 py-3 font-medium text-text transition-colors hover:bg-surface"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onChange(tempSelected);
                    setOpen(false);
                  }}
                  className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleSelectSheet;