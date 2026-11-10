import { useSearchParams } from "react-router";

import { useWatchQueueContext } from "./watch-queue";

const dialogSearchParam = "watch-queue";

export function useWatchQueue() {
  const {
    items,
    addMedia,
    clearQueue,
    removeMedia,
    selectedMedia,
    pickRandomMedia,
  } = useWatchQueueContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get(dialogSearchParam) === "1";

  const openDialog = () => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set(dialogSearchParam, "1");
        return nextParams;
      },
      { preventScrollReset: true },
    );
  };

  const closeDialog = () => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.delete(dialogSearchParam);
        return nextParams;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  return {
    items,
    isOpen,
    addMedia,
    clearQueue,
    openDialog,
    closeDialog,
    removeMedia,
    selectedMedia,
    pickRandomMedia,
  };
}
