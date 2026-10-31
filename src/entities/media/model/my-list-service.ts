import { createServiceToken } from "@/shared/lib";

import type { MyListCollection } from "./my-list";

/** Application port for loading the authenticated user's media list. */
export type MyListService = {
  getMyList(
    accessToken: string,
    userId: string,
    signal?: AbortSignal,
  ): Promise<MyListCollection>;
};

export const myListServiceToken =
  createServiceToken<MyListService>("myListService");
