/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query CurrentViewer {\n  Viewer {\n    id\n    name\n    siteUrl\n    avatar {\n      large\n      medium\n    }\n  }\n}": typeof types.CurrentViewerDocument,
    "query FilterOptions {\n  genres: GenreCollection\n  tags: MediaTagCollection {\n    id\n    name\n    isAdult\n  }\n}": typeof types.FilterOptionsDocument,
    "query SearchMedia($page: Int!, $perPage: Int!, $search: String, $genreIn: [String], $tagIn: [String], $statusIn: [MediaStatus], $formatIn: [MediaFormat], $sourceIn: [MediaSource], $isAdult: Boolean, $sort: [MediaSort]) {\n  Page(page: $page, perPage: $perPage) {\n    pageInfo {\n      hasNextPage\n      currentPage\n      total\n    }\n    media(\n      type: ANIME\n      search: $search\n      genre_in: $genreIn\n      tag_in: $tagIn\n      status_in: $statusIn\n      format_in: $formatIn\n      source_in: $sourceIn\n      isAdult: $isAdult\n      sort: $sort\n    ) {\n      id\n      title {\n        romaji\n        english\n        native\n      }\n      coverImage {\n        large\n        medium\n      }\n      averageScore\n      popularity\n      episodes\n      duration\n      seasonYear\n      format\n      source\n      genres\n      tags {\n        name\n      }\n      type\n      description\n      bannerImage\n      isAdult\n      status\n      startDate {\n        year\n        month\n        day\n      }\n      endDate {\n        year\n        month\n        day\n      }\n    }\n  }\n}": typeof types.SearchMediaDocument,
    "query ViewerMediaList($userId: Int!, $type: MediaType = ANIME) {\n  MediaListCollection(userId: $userId, type: $type) {\n    lists {\n      status\n      entries {\n        createdAt\n        updatedAt\n        startedAt {\n          year\n          month\n          day\n        }\n        completedAt {\n          year\n          month\n          day\n        }\n        status\n        score\n        progress\n        media {\n          id\n          title {\n            romaji\n            english\n            native\n          }\n          coverImage {\n            large\n            medium\n          }\n          averageScore\n          popularity\n          episodes\n          duration\n          startDate {\n            year\n            month\n            day\n          }\n          endDate {\n            year\n            month\n            day\n          }\n          seasonYear\n          format\n          source\n          genres\n          tags {\n            name\n          }\n          type\n          description\n          bannerImage\n          isAdult\n          status\n        }\n      }\n    }\n  }\n}": typeof types.ViewerMediaListDocument,
};
const documents: Documents = {
    "query CurrentViewer {\n  Viewer {\n    id\n    name\n    siteUrl\n    avatar {\n      large\n      medium\n    }\n  }\n}": types.CurrentViewerDocument,
    "query FilterOptions {\n  genres: GenreCollection\n  tags: MediaTagCollection {\n    id\n    name\n    isAdult\n  }\n}": types.FilterOptionsDocument,
    "query SearchMedia($page: Int!, $perPage: Int!, $search: String, $genreIn: [String], $tagIn: [String], $statusIn: [MediaStatus], $formatIn: [MediaFormat], $sourceIn: [MediaSource], $isAdult: Boolean, $sort: [MediaSort]) {\n  Page(page: $page, perPage: $perPage) {\n    pageInfo {\n      hasNextPage\n      currentPage\n      total\n    }\n    media(\n      type: ANIME\n      search: $search\n      genre_in: $genreIn\n      tag_in: $tagIn\n      status_in: $statusIn\n      format_in: $formatIn\n      source_in: $sourceIn\n      isAdult: $isAdult\n      sort: $sort\n    ) {\n      id\n      title {\n        romaji\n        english\n        native\n      }\n      coverImage {\n        large\n        medium\n      }\n      averageScore\n      popularity\n      episodes\n      duration\n      seasonYear\n      format\n      source\n      genres\n      tags {\n        name\n      }\n      type\n      description\n      bannerImage\n      isAdult\n      status\n      startDate {\n        year\n        month\n        day\n      }\n      endDate {\n        year\n        month\n        day\n      }\n    }\n  }\n}": types.SearchMediaDocument,
    "query ViewerMediaList($userId: Int!, $type: MediaType = ANIME) {\n  MediaListCollection(userId: $userId, type: $type) {\n    lists {\n      status\n      entries {\n        createdAt\n        updatedAt\n        startedAt {\n          year\n          month\n          day\n        }\n        completedAt {\n          year\n          month\n          day\n        }\n        status\n        score\n        progress\n        media {\n          id\n          title {\n            romaji\n            english\n            native\n          }\n          coverImage {\n            large\n            medium\n          }\n          averageScore\n          popularity\n          episodes\n          duration\n          startDate {\n            year\n            month\n            day\n          }\n          endDate {\n            year\n            month\n            day\n          }\n          seasonYear\n          format\n          source\n          genres\n          tags {\n            name\n          }\n          type\n          description\n          bannerImage\n          isAdult\n          status\n        }\n      }\n    }\n  }\n}": types.ViewerMediaListDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CurrentViewer {\n  Viewer {\n    id\n    name\n    siteUrl\n    avatar {\n      large\n      medium\n    }\n  }\n}"): (typeof documents)["query CurrentViewer {\n  Viewer {\n    id\n    name\n    siteUrl\n    avatar {\n      large\n      medium\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FilterOptions {\n  genres: GenreCollection\n  tags: MediaTagCollection {\n    id\n    name\n    isAdult\n  }\n}"): (typeof documents)["query FilterOptions {\n  genres: GenreCollection\n  tags: MediaTagCollection {\n    id\n    name\n    isAdult\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchMedia($page: Int!, $perPage: Int!, $search: String, $genreIn: [String], $tagIn: [String], $statusIn: [MediaStatus], $formatIn: [MediaFormat], $sourceIn: [MediaSource], $isAdult: Boolean, $sort: [MediaSort]) {\n  Page(page: $page, perPage: $perPage) {\n    pageInfo {\n      hasNextPage\n      currentPage\n      total\n    }\n    media(\n      type: ANIME\n      search: $search\n      genre_in: $genreIn\n      tag_in: $tagIn\n      status_in: $statusIn\n      format_in: $formatIn\n      source_in: $sourceIn\n      isAdult: $isAdult\n      sort: $sort\n    ) {\n      id\n      title {\n        romaji\n        english\n        native\n      }\n      coverImage {\n        large\n        medium\n      }\n      averageScore\n      popularity\n      episodes\n      duration\n      seasonYear\n      format\n      source\n      genres\n      tags {\n        name\n      }\n      type\n      description\n      bannerImage\n      isAdult\n      status\n      startDate {\n        year\n        month\n        day\n      }\n      endDate {\n        year\n        month\n        day\n      }\n    }\n  }\n}"): (typeof documents)["query SearchMedia($page: Int!, $perPage: Int!, $search: String, $genreIn: [String], $tagIn: [String], $statusIn: [MediaStatus], $formatIn: [MediaFormat], $sourceIn: [MediaSource], $isAdult: Boolean, $sort: [MediaSort]) {\n  Page(page: $page, perPage: $perPage) {\n    pageInfo {\n      hasNextPage\n      currentPage\n      total\n    }\n    media(\n      type: ANIME\n      search: $search\n      genre_in: $genreIn\n      tag_in: $tagIn\n      status_in: $statusIn\n      format_in: $formatIn\n      source_in: $sourceIn\n      isAdult: $isAdult\n      sort: $sort\n    ) {\n      id\n      title {\n        romaji\n        english\n        native\n      }\n      coverImage {\n        large\n        medium\n      }\n      averageScore\n      popularity\n      episodes\n      duration\n      seasonYear\n      format\n      source\n      genres\n      tags {\n        name\n      }\n      type\n      description\n      bannerImage\n      isAdult\n      status\n      startDate {\n        year\n        month\n        day\n      }\n      endDate {\n        year\n        month\n        day\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ViewerMediaList($userId: Int!, $type: MediaType = ANIME) {\n  MediaListCollection(userId: $userId, type: $type) {\n    lists {\n      status\n      entries {\n        createdAt\n        updatedAt\n        startedAt {\n          year\n          month\n          day\n        }\n        completedAt {\n          year\n          month\n          day\n        }\n        status\n        score\n        progress\n        media {\n          id\n          title {\n            romaji\n            english\n            native\n          }\n          coverImage {\n            large\n            medium\n          }\n          averageScore\n          popularity\n          episodes\n          duration\n          startDate {\n            year\n            month\n            day\n          }\n          endDate {\n            year\n            month\n            day\n          }\n          seasonYear\n          format\n          source\n          genres\n          tags {\n            name\n          }\n          type\n          description\n          bannerImage\n          isAdult\n          status\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query ViewerMediaList($userId: Int!, $type: MediaType = ANIME) {\n  MediaListCollection(userId: $userId, type: $type) {\n    lists {\n      status\n      entries {\n        createdAt\n        updatedAt\n        startedAt {\n          year\n          month\n          day\n        }\n        completedAt {\n          year\n          month\n          day\n        }\n        status\n        score\n        progress\n        media {\n          id\n          title {\n            romaji\n            english\n            native\n          }\n          coverImage {\n            large\n            medium\n          }\n          averageScore\n          popularity\n          episodes\n          duration\n          startDate {\n            year\n            month\n            day\n          }\n          endDate {\n            year\n            month\n            day\n          }\n          seasonYear\n          format\n          source\n          genres\n          tags {\n            name\n          }\n          type\n          description\n          bannerImage\n          isAdult\n          status\n        }\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;