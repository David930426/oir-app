"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  id?: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  /** Max-height for the chips container before scrolling. Tailwind class. */
  chipsMaxHeightClass?: string;
}

export function MultiSelect({
  id,
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  emptyMessage = "No matches.",
  className,
  disabled,
  chipsMaxHeightClass = "max-h-32",
}: MultiSelectProps) {
  const selectedOptions = options.filter((o) => value.includes(o.value));
  const availableOptions = options.filter((o) => !value.includes(o.value));
  const allSelected =
    options.length > 0 && availableOptions.length === 0;

  return (
    <Combobox.Root<MultiSelectOption, true>
      items={availableOptions}
      multiple
      value={selectedOptions}
      onValueChange={(selected) =>
        onValueChange((selected ?? []).map((o) => o.value))
      }
      itemToStringValue={(item) => item.value}
      itemToStringLabel={(item) => item.label}
      isItemEqualToValue={(a, b) => a.value === b.value}
      disabled={disabled}
    >
      <Combobox.Chips
        className={cn(
          "flex min-h-10 w-full max-w-full flex-wrap items-center gap-1.5 overflow-y-auto rounded-md border border-input bg-background px-2 py-1.5 text-sm shadow-sm transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
          chipsMaxHeightClass,
          className,
        )}
      >
        {selectedOptions.map((option) => (
          <Combobox.Chip
            key={option.value}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 ring-1 ring-slate-200"
            aria-label={option.label}
          >
            <span className="truncate max-w-[16ch]">{option.label}</span>
            <Combobox.ChipRemove
              className="rounded p-0.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              aria-label={`Remove ${option.label}`}
            >
              <X className="h-3 w-3" />
            </Combobox.ChipRemove>
          </Combobox.Chip>
        ))}
        <Combobox.Input
          id={id}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[8ch] bg-transparent text-sm outline-none placeholder:text-slate-300"
        />
        <Combobox.Trigger
          className="ml-auto rounded p-1 text-slate-500 hover:text-slate-900 hover:cursor-pointer focus:outline-none"
          aria-label="Toggle list"
        >
          <ChevronDown className="h-4 w-4" />
        </Combobox.Trigger>
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner
          sideOffset={6}
          className="z-50 w-(--anchor-width) max-w-[min(100vw-2rem,32rem)]"
        >
          <Combobox.Popup className="max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white shadow-xl outline-none">
            <Combobox.Empty className="px-3 py-6 text-center text-sm text-slate-500">
              {allSelected ? "All options selected." : emptyMessage}
            </Combobox.Empty>
            <Combobox.List className="p-1">
              {(option: MultiSelectOption) => (
                <Combobox.Item
                  key={option.value}
                  value={option}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none data-[highlighted]:bg-slate-100"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 bg-white">
                    <Combobox.ItemIndicator>
                      <Check className="h-3 w-3 text-slate-900" />
                    </Combobox.ItemIndicator>
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-slate-900">
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="truncate text-xs text-slate-500">
                        {option.description}
                      </span>
                    )}
                  </div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
