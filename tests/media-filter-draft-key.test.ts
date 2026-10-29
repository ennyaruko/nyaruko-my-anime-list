import { it, expect, describe } from "vitest";

import { createMediaFilterDraftKey } from "../src/features/filters/model/useMediaFilters";

describe("createMediaFilterDraftKey", () => {
  it("keeps drafts stable for the same route and initial URL filters", () => {
    const storageKey = "media-filter-settings:v2:search:user-1";
    const initialFiltersKey = JSON.stringify({ genres: ["Fantasy"] });

    expect(
      createMediaFilterDraftKey(storageKey, "/search", initialFiltersKey),
    ).toBe(
      createMediaFilterDraftKey(storageKey, "/search", initialFiltersKey),
    );
    expect(
      createMediaFilterDraftKey(
        storageKey,
        "/search",
        JSON.stringify({ genres: ["Comedy"] }),
      ),
    ).not.toBe(
      createMediaFilterDraftKey(storageKey, "/search", initialFiltersKey),
    );
  });
});
