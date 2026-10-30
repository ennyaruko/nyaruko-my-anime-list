/** One exit callback per page visit, including SPA unmount and document teardown. */
export function createWatchPageExitSubscription(onExit: () => void) {
  let mounted = false;
  let handled = false;
  const exit = () => {
    if (handled) return;
    handled = true;
    onExit();
  };
  const restore = () => {
    handled = false;
  };

  return (target: EventTarget) => {
    mounted = true;
    target.addEventListener("pagehide", exit);
    target.addEventListener("pageshow", restore);
    return () => {
      mounted = false;
      target.removeEventListener("pagehide", exit);
      target.removeEventListener("pageshow", restore);
      // StrictMode reattaches immediately. Only a real unmount is an exit.
      queueMicrotask(() => {
        if (!mounted) exit();
      });
    };
  };
}
