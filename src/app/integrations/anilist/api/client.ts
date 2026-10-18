import { GraphQLClient } from "graphql-request";

import type { AniListViewerDto } from "./dto";
import { CurrentViewerDocument } from "./queries";

function getGraphQLEndpoint(): string {
  const endpoint = import.meta.env.VITE_ANILIST_GRAPHQL_ENDPOINT?.trim();
  if (!endpoint) {
    throw new Error(
      "AniList GraphQL is not configured. Set VITE_ANILIST_GRAPHQL_ENDPOINT.",
    );
  }
  return endpoint;
}

/** Creates a request-scoped client; access tokens are never kept in a singleton. */
export function createAniListGraphQLClient(
  accessToken?: string,
): GraphQLClient {
  return new GraphQLClient(getGraphQLEndpoint(), {
    ...(accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : {}),
  });
}

/** Low-level provider request. Mapping to AccountProfile belongs to the adapter. */
export async function getViewer(
  accessToken: string,
  signal?: AbortSignal,
): Promise<AniListViewerDto> {
  const client = createAniListGraphQLClient(accessToken);
  const response = await client.request({
    signal,
    variables: {},
    document: CurrentViewerDocument,
  });
  if (!response.Viewer) {
    throw new Error("AniList did not return the authenticated viewer.");
  }
  return response.Viewer;
}
