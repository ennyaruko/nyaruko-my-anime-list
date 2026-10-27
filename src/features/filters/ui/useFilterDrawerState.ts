import { useCallback } from "react";
import { useSearchParams } from "react-router";

export function useFilterDrawerState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const open = searchParams.get("filters") === "open";

  const onOpenChange = useCallback(
    (nextOpen: boolean) => {
      const nextSearchParams = new URLSearchParams(searchParams);

      if (nextOpen) nextSearchParams.set("filters", "open");
      else nextSearchParams.delete("filters");

      setSearchParams(nextSearchParams, {
        replace: !nextOpen,
        preventScrollReset: true,
      });
    },
    [searchParams, setSearchParams],
  );

  return { open, onOpenChange };
}
