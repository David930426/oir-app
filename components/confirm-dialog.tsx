"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { AlertTriangle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";

type Tone = "danger" | "warning" | "default";

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const fn = useContext(ConfirmContext);
  if (!fn) {
    throw new Error("useConfirm must be used inside <ConfirmDialogProvider>");
  }
  return fn;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
}

const DEFAULT_STATE: ConfirmState = {
  open: false,
  title: "",
};

export function ConfirmDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ConfirmState>(DEFAULT_STATE);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setState({ ...options, open: true });
    });
  }, []);

  const settle = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const tone: Tone = state.tone ?? "default";
  const confirmClassName =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : tone === "warning"
        ? "bg-amber-600 hover:bg-amber-700 text-white"
        : "bg-blue-600 hover:bg-blue-700 text-white";
  const iconClassName =
    tone === "danger"
      ? "text-red-600 bg-red-50"
      : tone === "warning"
        ? "text-amber-600 bg-amber-50"
        : "text-blue-600 bg-blue-50";

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <AlertDialog.Root
        open={state.open}
        onOpenChange={(open) => {
          if (!open) settle(false);
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <AlertDialog.Popup
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0"
            aria-describedby={state.description ? "confirm-desc" : undefined}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <AlertDialog.Title className="text-base font-semibold text-slate-900">
                  {state.title}
                </AlertDialog.Title>
                {state.description && (
                  <AlertDialog.Description
                    id="confirm-desc"
                    className="text-sm text-slate-600"
                  >
                    {state.description}
                  </AlertDialog.Description>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => settle(false)}
                className="hover:cursor-pointer"
              >
                {state.cancelLabel ?? "Cancel"}
              </Button>
              <Button
                type="button"
                onClick={() => settle(true)}
                className={`hover:cursor-pointer ${confirmClassName}`}
                autoFocus
              >
                {state.confirmLabel ?? "Confirm"}
              </Button>
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext.Provider>
  );
}
