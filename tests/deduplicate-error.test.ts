import { it, expect, describe } from "vitest";

import { deduplicateError } from "../src/shared/lib/react-query/queryClient/utils/deduplicateError";

describe("deduplicateError", () => {
  it("deduplicates the same network error across query keys", () => {
    const error = new TypeError(`Failed to fetch ${crypto.randomUUID()}`);

    expect(deduplicateError(error, ["media-detail", 1])).toBe(false);
    expect(deduplicateError(error, ["media-recommendations", 1])).toBe(true);
  });

  it("keeps different network errors separate", () => {
    const unique = crypto.randomUUID();

    expect(deduplicateError(new TypeError(`offline ${unique}`))).toBe(false);
    expect(deduplicateError(new TypeError(`timeout ${unique}`))).toBe(false);
  });
});
