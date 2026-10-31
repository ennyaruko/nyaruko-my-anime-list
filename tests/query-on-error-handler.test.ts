import { it, vi, expect, describe, beforeEach } from "vitest";

import { showNotification } from "../src/shared/ui";
import { queryOnErrorHandler } from "../src/shared/lib/react-query/queryClient/utils/queryOnErrorHandler";

vi.mock("@/shared/ui", () => ({
  showNotification: vi.fn(),
}));

describe("queryOnErrorHandler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not notify for a failed background refresh with cached data", () => {
    queryOnErrorHandler({
      hasData: true,
      error: new TypeError("Network unavailable"),
      queryKey: ["background-refresh", crypto.randomUUID()],
    });

    expect(showNotification).not.toHaveBeenCalled();
  });

  it("still notifies when the initial query has no data", () => {
    queryOnErrorHandler({
      hasData: false,
      error: new TypeError("Network unavailable"),
      queryKey: ["initial-load", crypto.randomUUID()],
    });

    expect(showNotification).toHaveBeenCalledOnce();
  });
});
