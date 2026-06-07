import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

const TYPES = [
  { id: "", name: "All Types" },
  { id: "income", name: "Income" },
  { id: "expense", name: "Expense" },
  { id: "investment", name: "Investment" },
];

export default function TypeSelect({ value, onChange }) {
  const selected =
    TYPES.find((type) => type.id === value) || TYPES[0];

  return (
    <div>
      <label className="block text-md font-semibold text-muted mb-1">
        Type
      </label>

      <Listbox value={selected} onChange={(item) => onChange(item.id)}>
        <div className="relative">

          <ListboxButton
            className="w-full p-2.5 border border-input-border rounded-xl bg-input-bg text-text focus:outline-none focus:border-input-focus transition-colors text-sm text-left hover:cursor-pointer" >

            <span className="block truncate">
              {selected.name}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon className="h-5 w-5 text-muted" />
            </span>
          </ListboxButton>

          <ListboxOptions
            anchor="bottom"
            transition
            className="
              min-w-(--button-width)
              w-(--button-width)
              z-50 mt-1 
              overflow-auto rounded-xl
              border border-border
              bg-surface shadow-lg
              py-1
              transition duration-150 ease-out
              data-closed:scale-95
              data-closed:opacity-0
              focus:outline-none
              focus:ring-0
              focus-visible:outline-none
            "
          >
            {TYPES.map((type) => (
              <ListboxOption
                key={type.id}
                value={type}
                className="
                  group flex cursor-pointer items-center
                  justify-between px-4 py-2
                  text-text
                  data-focus:bg-primary/10
                  data-focus:text-primary
                "
              >
                <span className="group-data-selected:font-medium">
                  {type.name}
                </span>

                <CheckIcon
                  className="
                    h-4 w-4 text-primary
                    invisible
                    group-data-selected:visible
                  "
                />
              </ListboxOption>
            ))}
          </ListboxOptions>

        </div>
      </Listbox>
    </div>
  );
}