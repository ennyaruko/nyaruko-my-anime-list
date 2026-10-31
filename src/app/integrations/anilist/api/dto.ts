import type { CurrentViewerQuery } from "./generated/graphql";

/** Derived from the generated operation to avoid duplicating GraphQL DTO shape. */
export type AniListCurrentViewerResponse = CurrentViewerQuery;
export type AniListViewerDto = NonNullable<CurrentViewerQuery["Viewer"]>;
