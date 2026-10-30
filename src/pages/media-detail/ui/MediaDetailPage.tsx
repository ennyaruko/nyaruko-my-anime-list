import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { MediaRelations } from "@/widgets/media-relations";

import { useAuth } from "@/entities/auth";
import type { Media } from "@/entities/media";
import type { AccountProfile } from "@/entities/account";
import { mediaDetailServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Header,
  Column,
  Container,
  BlockStatusNotFound,
  ComponentErrorBoundary,
} from "@/shared/ui";

import { MediaTags } from "./MediaTags";
import { MediaReviews } from "./MediaReviews";
import { MediaDescription } from "./MediaDescription";
import { MediaInformation } from "./MediaInformation";
import { MediaScreenshots } from "./MediaScreenshots";
import { MediaRecommendations } from "./MediaRecommendations";
import {
  MediaDetailHero,
  MediaDetailBackLink,
  MediaDetailHeroSkeleton,
} from "./MediaDetailHero";

import * as styles from "./MediaDetailPage.css";

type MediaDetailPageProps = {
  mediaId: number;
  userId: undefined | AccountProfile["id"];
};

type MediaRouteState = { media?: Media };

export function MediaDetailPage({ userId, mediaId }: MediaDetailPageProps) {
  const { i18n } = useTranslation(["common"]);
  const { accessToken } = useAuth();
  const location = useLocation();
  const service = useAppService(mediaDetailServiceToken);
  const state = location.state as null | MediaRouteState;
  const initialMedia = state?.media?.id === mediaId ? state.media : undefined;
  const queryKey = queryCacheConfig.families.mediaDetail.key(
    userId ?? "unknown",
    mediaId,
  );
  const detailQuery = useQuery({
    queryKey,
    enabled: Boolean(accessToken && userId && Number.isFinite(mediaId)),
    queryFn: ({ signal }) => {
      if (!accessToken) {
        throw new Error("An authenticated AniList session is required.");
      }

      return service.getMediaDetail(accessToken, mediaId, signal);
    },
  });
  const detail = detailQuery.data;
  const media = detail?.media ?? initialMedia;
  const tags = detail?.tags ?? (detailQuery.isError ? [] : undefined);

  if (mediaId <= 0 || !Number.isFinite(mediaId)) {
    return <BlockStatusNotFound className={styles.notFound} />;
  }

  if (detailQuery.isError && !media) {
    return <BlockStatusNotFound className={styles.notFound} />;
  }

  return (
    <Container as="main" className={styles.page}>
      <Column gap="xl">
        <Header variant="plain" leading={<MediaDetailBackLink />} />

        {media ? (
          <ComponentErrorBoundary resetKeys={[mediaId]}>
            <MediaDetailHero media={media} userId={userId} />
          </ComponentErrorBoundary>
        ) : (
          <section className={styles.heroSection}>
            <MediaDetailHeroSkeleton />
          </section>
        )}

        <ComponentErrorBoundary resetKeys={[mediaId]}>
          <MediaInformation media={media} language={i18n.language} />
        </ComponentErrorBoundary>
        <ComponentErrorBoundary resetKeys={[mediaId]}>
          <MediaDescription media={media} />
        </ComponentErrorBoundary>
        <ComponentErrorBoundary resetKeys={[mediaId]}>
          <MediaScreenshots detail={detail} />
        </ComponentErrorBoundary>
        <MediaRelations userId={userId} mediaId={mediaId} />
        <MediaReviews userId={userId} mediaId={mediaId} />
        <MediaRecommendations userId={userId} mediaId={mediaId} />
        <ComponentErrorBoundary resetKeys={[mediaId]}>
          <MediaTags tags={tags} />
        </ComponentErrorBoundary>
      </Column>
    </Container>
  );
}
