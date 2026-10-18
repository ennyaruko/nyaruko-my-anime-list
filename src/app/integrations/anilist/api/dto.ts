/** Raw AniList DTOs. Keep these types inside the provider integration boundary. */
export interface AniListViewerDto {
  id: number;
  name: string;
  siteUrl?: null | string;
  avatar?: null | { large?: null | string; medium?: null | string };
}

export interface AniListCurrentViewerResponse {
  Viewer: null | AniListViewerDto;
}
