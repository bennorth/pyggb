import { useEffect } from "react";

export function useDismissOnEscape(dismiss: () => void) {
  const maybeDismiss = (evt: KeyboardEvent) => {
    if (evt.key === "Escape") {
      dismiss();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", maybeDismiss);
    return () => window.removeEventListener("keydown", maybeDismiss);
  }, [dismiss]);
}
