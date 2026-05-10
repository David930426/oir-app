"use client";

import { useEffect, useRef } from "react";

interface SelectCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (value: boolean) => void;
  ariaLabel: string;
}

export function SelectCheckbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: SelectCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={ariaLabel}
      className="h-4 w-4 rounded border-slate-300 text-blue-700 hover:cursor-pointer focus:ring-blue-600 focus:ring-offset-0 transition-all"
      onClick={(e) => e.stopPropagation()}
    />
  );
}
