import { it, vi, expect, describe } from "vitest";

import { progressAfterWatchPageExit } from "../src/entities/media/model/media-playback";
import { createWatchPageExitSubscription } from "../src/pages/media-watch/model/watch-page-exit";

describe("watch page exit lifecycle", () => {
  it("ignores StrictMode setup/cleanup replay and saves only on actual SPA exit", async () => {
    const target = new EventTarget();
    const save = vi.fn();
    const subscribe = createWatchPageExitSubscription(save);
    const firstCleanup = subscribe(target);
    firstCleanup();
    const cleanup = subscribe(target);
    await Promise.resolve();
    expect(save).not.toHaveBeenCalled();
    cleanup();
    await Promise.resolve();
    expect(save).toHaveBeenCalledTimes(1);
  });
  it("deduplicates pagehide and unmount, and handles a restored browser page", async () => {
    const target = new EventTarget();
    const save = vi.fn();
    const subscribe = createWatchPageExitSubscription(save);
    const cleanup = subscribe(target);
    target.dispatchEvent(new Event("pagehide"));
    expect(save).toHaveBeenCalledTimes(1);
    target.dispatchEvent(new Event("pageshow"));
    target.dispatchEvent(new Event("pagehide"));
    cleanup();
    await Promise.resolve();
    expect(save).toHaveBeenCalledTimes(2);
  });
  it("leaving episode 1 never saves, while leaving episode 12 after 11 does", async () => {
    for (const [progress, episode, expected] of [
      [0, 1, 0],
      [10, 11, 0],
      [11, 12, 1],
    ]) {
      const save = vi.fn();
      const subscribe = createWatchPageExitSubscription(() => {
        const next = progressAfterWatchPageExit(progress, episode, 12);
        if (next > progress) save(next);
      });
      const target = new EventTarget();
      const cleanup = subscribe(target);
      target.dispatchEvent(new Event("pagehide"));
      cleanup();
      await Promise.resolve();
      expect(save).toHaveBeenCalledTimes(expected);
      if (expected) expect(save).toHaveBeenCalledWith(12);
    }
  });
});
