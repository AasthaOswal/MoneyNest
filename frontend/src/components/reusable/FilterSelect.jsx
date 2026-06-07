import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  const selected =
    options.find((option) => option.id === value) ||
    options[0];

  return (
    <div>
      {label && (
        <label className="block text-md font-semibold text-muted mb-1">
          {label}
        </label>
      )}

      <Listbox
        value={selected}
        onChange={(item) => onChange(item.id)}
      >
        <div className="relative">
          <ListboxButton
            className="
              w-full min-w-45
              p-2.5
              border border-input-border
              rounded-xl
              bg-input-bg
              text-text
              text-left text-sm
              focus:outline-none
              focus:border-input-focus
              transition-colors
              hover:cursor-pointer
            "
          >
            <span className="block truncate">
              {selected.name}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon className="h-5 w-5 text-muted" />
            </span>
          </ListboxButton>

          <ListboxOptions
            anchor="bottom start"
            transition
            className="
                z-50 mt-1

                min-w-(--button-width)

                overflow-auto
                rounded-xl
                border border-border
                bg-surface
                shadow-lg
                py-1

                transition duration-150 ease-out
                data-closed:scale-95
                data-closed:opacity-0

                focus:outline-none
                focus:ring-0
                focus-visible:outline-none
            "
          >
            {options.map((option) => (
              <ListboxOption
                key={option.id}
                value={option}
                className="
                  group
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  px-4 py-2
                  text-text
                  data-focus:bg-primary/10
                  data-focus:text-primary
                "
              >
                <span className="group-data-selected:font-medium">
                  {option.name}
                </span>

                <CheckIcon
                  className="
                    h-4 w-4
                    text-primary
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
};

export default FilterSelect;