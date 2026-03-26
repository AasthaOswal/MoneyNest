// import { useEffect, useMemo, useState } from "react";

// const MultiSelectSheet = ({
//   label,
//   title,
//   options = [],
//   selectedIds = [],
//   onChange,
//   placeholder = "Select items",
//   emptyText = "No items found.",
//   accent = "primary", // "primary" | "income" | "expense" | "investment"
// }) => {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [tempSelected, setTempSelected] = useState([]);

//   useEffect(() => {
//     if (open) {
//       setTempSelected(selectedIds);
//       setSearch("");
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open, selectedIds]);

//   const selectedItems = useMemo(() => {
//     return options.filter((item) => selectedIds.includes(item._id));
//   }, [options, selectedIds]);

//   const tempSelectedItems = useMemo(() => {
//     return options.filter((item) => tempSelected.includes(item._id));
//   }, [options, tempSelected]);

//   const filteredOptions = useMemo(() => {
//     const q = search.trim().toLowerCase();

//     let list = q
//       ? options.filter((item) => item.name.toLowerCase().includes(q))
//       : options;

//     const selectedSet = new Set(tempSelected);
//     const selectedFirst = [
//       ...list.filter((item) => selectedSet.has(item._id)),
//       ...list.filter((item) => !selectedSet.has(item._id)),
//     ];

//     return selectedFirst;
//   }, [options, search, tempSelected]);

//   const toggleItem = (id) => {
//     setTempSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const removeSelected = (id) => {
//     onChange(selectedIds.filter((x) => x !== id));
//   };

//   const getAccentClass = () => {
//     switch (accent) {
//       case "income":
//         return "border-income text-income";
//       case "expense":
//         return "border-expense text-expense";
//       case "investment":
//         return "border-investment text-investment";
//       default:
//         return "border-primary text-primary";
//     }
//   };

//   const getAccentBgClass = () => {
//     switch (accent) {
//       case "income":
//         return "bg-income";
//       case "expense":
//         return "bg-expense";
//       case "investment":
//         return "bg-investment";
//       default:
//         return "bg-primary";
//     }
//   };

//   const selectedCount = selectedIds.length;
//   const buttonText =
//     selectedCount === 0
//       ? placeholder
//       : selectedCount === 1
//       ? selectedItems[0]?.name
//       : `${selectedCount} selected`;

//   return (
//     <div>
//       <label className="mb-2 block text-sm font-medium text-text">
//         {label} <span className="text-expense">*</span>
//       </label>

//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-left text-sm text-text shadow-sm transition-all hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//       >
//         <span className={selectedCount === 0 ? "text-muted" : "text-text"}>
//           {buttonText}
//         </span>
//         <span className="text-xs text-muted">
//           {selectedCount > 0 ? selectedCount : "Select"}
//         </span>
//       </button>

//       {selectedItems.length > 0 && (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {selectedItems.map((item) => (
//             <span
//               key={item._id}
//               className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getAccentClass()} bg-surface`}
//             >
//               {item.name}
//               <button
//                 type="button"
//                 onClick={() => removeSelected(item._id)}
//                 className="text-current/80 hover:text-current"
//                 aria-label={`Remove ${item.name}`}
//               >
//                 ✕
//               </button>
//             </span>
//           ))}
//         </div>
//       )}

//       <p className="mt-2 text-xs text-muted">{placeholder}</p>

//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/50">
//           <div className="mx-auto flex h-full w-full flex-col bg-surface md:h-full md:max-w-4xl md:rounded-none">
//             <div className="flex items-center justify-between border-b border-border px-4 py-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-text">{title}</h3>
//                 <p className="text-xs text-muted">
//                   Search and select multiple items
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors hover:bg-bg"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="border-b border-border px-4 py-4">
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search..."
//                 className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
//               />
//             </div>

//             <div className="border-b border-border px-4 py-3">
//               <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
//                 Selected
//               </div>

//               {tempSelectedItems.length === 0 ? (
//                 <p className="text-sm text-muted">No items selected yet.</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {tempSelectedItems.map((item) => (
//                     <span
//                       key={item._id}
//                       className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-white ${getAccentBgClass()}`}
//                     >
//                       {item.name}
//                       <button
//                         type="button"
//                         onClick={() => toggleItem(item._id)}
//                         className="text-white/90 hover:text-white"
//                         aria-label={`Remove ${item.name}`}
//                       >
//                         ✕
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 overflow-y-auto px-4 py-4">
//               {filteredOptions.length === 0 ? (
//                 <div className="rounded-xl border border-border bg-bg px-4 py-4 text-sm text-muted">
//                   {emptyText}
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {filteredOptions.map((item) => {
//                     const checked = tempSelected.includes(item._id);

//                     return (
//                       <label
//                         key={item._id}
//                         className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
//                           checked
//                             ? "border-primary bg-bg"
//                             : "border-border bg-surface hover:bg-bg"
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={checked}
//                           onChange={() => toggleItem(item._id)}
//                           className="h-4 w-4 accent-blue-500"
//                         />
//                         <span className="flex-1 text-sm text-text">
//                           {item.name}
//                         </span>
//                       </label>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             <div className="border-t border-border px-4 py-4">
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setOpen(false)}
//                   className="flex-1 rounded-xl border border-border bg-bg px-4 py-3 font-medium text-text transition-colors hover:bg-surface"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     onChange(tempSelected);
//                     setOpen(false);
//                   }}
//                   className={`flex-1 rounded-xl px-4 py-3 font-medium text-white transition-colors ${
//                     accent === "income"
//                       ? "bg-income hover:opacity-90"
//                       : accent === "expense"
//                       ? "bg-expense hover:opacity-90"
//                       : accent === "investment"
//                       ? "bg-investment hover:opacity-90"
//                       : "bg-primary hover:bg-primary-hover"
//                   }`}
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiSelectSheet;









//=========================================================================================








// import { useEffect, useMemo, useState } from "react";

// const MultiSelectSheet = ({
//   label,
//   title,
//   options = [],
//   selectedIds = [],
//   onChange,
//   onSearch, // optional: parent can fetch categories/labels here
//   placeholder = "Select items",
//   emptyText = "No items found.",
// }) => {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [tempSelected, setTempSelected] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setTempSelected(selectedIds);
//       setSearch("");
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//       setIsSearching(false);
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [open, selectedIds]);

//   const selectedItems = useMemo(() => {
//     return options.filter((item) => selectedIds.includes(item._id));
//   }, [options, selectedIds]);

//   const tempSelectedItems = useMemo(() => {
//     return options.filter((item) => tempSelected.includes(item._id));
//   }, [options, tempSelected]);

//   const filteredOptions = useMemo(() => {
//     const q = search.trim().toLowerCase();

//     let list = q
//       ? options.filter((item) => item.name.toLowerCase().includes(q))
//       : options;

//     const selectedSet = new Set(tempSelected);
//     return [
//       ...list.filter((item) => selectedSet.has(item._id)),
//       ...list.filter((item) => !selectedSet.has(item._id)),
//     ];
//   }, [options, search, tempSelected]);

//   const toggleItem = (id) => {
//     setTempSelected((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const removeSelected = (id) => {
//     onChange(selectedIds.filter((x) => x !== id));
//   };

//   const handleSearchClick = async () => {
//     if (!onSearch) return;

//     setIsSearching(true);
//     try {
//       await onSearch(search.trim());
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const selectedCount = selectedIds.length;
//   const buttonText =
//     selectedCount === 0
//       ? placeholder
//       : selectedCount === 1
//       ? selectedItems[0]?.name
//       : `${selectedCount} selected`;

//   return (
//     <div>
//       <label className="mb-2 block text-sm font-medium text-text">
//         {label} <span className="text-expense">*</span>
//       </label>

//       <button
//         type="button"
//         onClick={() => setOpen(true)}
//         className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-left text-sm text-text shadow-sm transition-all hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
//       >
//         <span className={selectedCount === 0 ? "text-muted" : "text-text"}>
//           {buttonText}
//         </span>
//         <span className="text-xs text-muted">
//           {selectedCount > 0 ? selectedCount : "Select"}
//         </span>
//       </button>

//       {selectedItems.length > 0 && (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {selectedItems.map((item) => (
//             <span
//               key={item._id}
//               className="inline-flex items-center gap-2 rounded-full border border-primary bg-surface px-3 py-1 text-xs font-medium text-primary"
//             >
//               {item.name}
//               <button
//                 type="button"
//                 onClick={() => removeSelected(item._id)}
//                 className="text-current/80 hover:text-current"
//                 aria-label={`Remove ${item.name}`}
//               >
//                 ✕
//               </button>
//             </span>
//           ))}
//         </div>
//       )}

//       <p className="mt-2 text-xs text-muted">{placeholder}</p>

//       {open && (
//         <div className="fixed inset-0 z-50 bg-black/50">
//           <div className="mx-auto flex h-full w-full flex-col bg-surface md:h-full md:max-w-4xl md:rounded-none">
//             <div className="flex items-center justify-between border-b border-border px-4 py-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-text">{title}</h3>
//                 <p className="text-xs text-muted">
//                   Search and select multiple items
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={() => setOpen(false)}
//                 className="rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors hover:bg-bg"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="border-b border-border px-4 py-4">
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") handleSearchClick();
//                   }}
//                   placeholder={`Search ${label.toLowerCase()}...`}
//                   className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-text outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-primary"
//                 />

//                 <button
//                   type="button"
//                   onClick={handleSearchClick}
//                   disabled={isSearching}
//                   className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
//                 >
//                   {isSearching ? "Searching..." : "Search"}
//                 </button>
//               </div>

//               <p className="mt-2 text-xs text-muted">
//                 Click Search to load matching {label.toLowerCase()}.
//               </p>
//             </div>

//             <div className="border-b border-border px-4 py-3">
//               <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
//                 Selected
//               </div>

//               {tempSelectedItems.length === 0 ? (
//                 <p className="text-sm text-muted">No items selected yet.</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {tempSelectedItems.map((item) => (
//                     <span
//                       key={item._id}
//                       className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white"
//                     >
//                       {item.name}
//                       <button
//                         type="button"
//                         onClick={() => toggleItem(item._id)}
//                         className="text-white/90 hover:text-white"
//                         aria-label={`Remove ${item.name}`}
//                       >
//                         ✕
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 overflow-y-auto px-4 py-4">
//               {filteredOptions.length === 0 ? (
//                 <div className="rounded-xl border border-border bg-bg px-4 py-4 text-sm text-muted">
//                   {emptyText}
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   {filteredOptions.map((item) => {
//                     const checked = tempSelected.includes(item._id);

//                     return (
//                       <label
//                         key={item._id}
//                         className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
//                           checked
//                             ? "border-primary bg-bg"
//                             : "border-border bg-surface hover:bg-bg"
//                         }`}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={checked}
//                           onChange={() => toggleItem(item._id)}
//                           className="h-4 w-4 accent-blue-500"
//                         />
//                         <span className="flex-1 text-sm text-text">
//                           {item.name}
//                         </span>
//                       </label>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             <div className="border-t border-border px-4 py-4">
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setOpen(false)}
//                   className="flex-1 rounded-xl border border-border bg-bg px-4 py-3 font-medium text-text transition-colors hover:bg-surface"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     onChange(tempSelected);
//                     setOpen(false);
//                   }}
//                   className="flex-1 rounded-xl bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiSelectSheet;















//=====================================================================================================================================





import { useEffect, useMemo, useState } from "react";

const MultiSelectSheet = ({
  label,
  title,
  options = [],
  selectedIds = [],
  onChange,
  placeholder = "Select items",
  emptyText = "No items found.",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempSelected, setTempSelected] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (open) {
      setTempSelected(selectedIds);
      setSearch("");
      setShowOptions(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, selectedIds]);

  const selectedItems = useMemo(() => {
    return options.filter((item) => selectedIds.includes(item._id));
  }, [options, selectedIds]);

  const tempSelectedItems = useMemo(() => {
    return options.filter((item) => tempSelected.includes(item._id));
  }, [options, tempSelected]);

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = q
      ? options.filter((item) => item.name.toLowerCase().includes(q))
      : options;

    const selectedSet = new Set(tempSelected);
    return [
      ...list.filter((item) => selectedSet.has(item._id)),
      ...list.filter((item) => !selectedSet.has(item._id)),
    ];
  }, [options, search, tempSelected]);

  const toggleItem = (id) => {
    setTempSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const removeSelected = (id) => {
    onChange(selectedIds.filter((x) => x !== id));
  };

  const selectedCount = selectedIds.length;
  const buttonText =
    selectedCount === 0
      ? placeholder
      : selectedCount === 1
      ? selectedItems[0]?.name
      : `${selectedCount} selected`;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text">
        {label} <span className="text-expense">*</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-bg px-4 py-3 text-left text-sm text-text shadow-sm transition-all hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <span className={selectedCount === 0 ? "text-muted" : "text-text"}>
          {buttonText}
        </span>
        <span className="text-xs text-muted">
          {selectedCount > 0 ? selectedCount : "Select"}
        </span>
      </button>

      {selectedItems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <span
              key={item._id}
              className="inline-flex items-center gap-2 rounded-full border border-primary bg-surface px-3 py-1 text-xs font-medium text-primary"
            >
              {item.name}
              <button
                type="button"
                onClick={() => removeSelected(item._id)}
                className="text-current/80 hover:text-current"
                aria-label={`Remove ${item.name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="mt-2 text-xs text-muted">{placeholder}</p>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="mx-auto flex h-full w-full flex-col bg-surface md:h-full md:max-w-4xl md:rounded-none">
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div>
                <h3 className="text-lg font-semibold text-text">{title}</h3>
                <p className="text-xs text-muted">
                  Search and select multiple items
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

            <div className="border-b border-border px-4 py-3">
              <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
                Selected
              </div>

              {tempSelectedItems.length === 0 ? (
                <p className="text-sm text-muted">No items selected yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tempSelectedItems.map((item) => (
                    <span
                      key={item._id}
                      className="inline-flex items-center gap-2 rounded-full border border-primary bg-surface px-3 py-1 text-xs font-medium text-primary"
                    >
                      {item.name}
                      <button
                        type="button"
                        onClick={() => toggleItem(item._id)}
                        className="text-primary/80 hover:text-primary"
                        aria-label={`Remove ${item.name}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

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
                    const checked = tempSelected.includes(item._id);

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
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem(item._id)}
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

export default MultiSelectSheet;