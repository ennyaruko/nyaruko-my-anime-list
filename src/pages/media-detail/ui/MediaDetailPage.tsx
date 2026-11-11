import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { MediaRelations } from "@/widgets/media-relations";

import { useAdultContent } from "@/features/toggle-adult-content";

import { useAuth } from "@/entities/auth";
import type { Media } from "@/entities/media";
import type { AccountProfile } from "@/entities/account";
import { mediaDetailServiceToken } from "@/entities/media";
import { isMediaVisibleInContentMode } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Row,
  Header,
  Column,
  Spinner,
  Container,
  PullToRefresh,
  BlockStatusNotFound,
  ComponentErrorBoundary,
} from "@/shared/ui";

import { useMediaDetailRefresh } from "../model/useMediaDetailRefresh";

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
  const { mode: contentMode } = useAdultContent();
  const { accessToken } = useAuth();
  const location = useLocation();
  const service = useAppService(mediaDetailServiceToken);
  const state = location.state as null | MediaRouteState;
  const initialMedia =
    state?.media?.id === mediaId &&
    isMediaVisibleInContentMode(state.media, contentMode)
      ? state.media
      : undefined;
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
  const refreshMedia = useMediaDetailRefresh({
    userId,
    mediaId,
    contentMode,
    malId: detail?.malId,
  });

  if (mediaId <= 0 || !Number.isFinite(mediaId)) {
    return (
      <Row wide alignItem="center" justifyContent="center">
        <BlockStatusNotFound />
      </Row>
    );
  }

  if (detail && !isMediaVisibleInContentMode(detail.media, contentMode)) {
    return (
      <Row wide alignItem="center" justifyContent="center">
        <BlockStatusNotFound />
      </Row>
    );
  }

  if (detailQuery.isError && !media) {
    return (
      <Row wide alignItem="center" justifyContent="center">
        <BlockStatusNotFound />
      </Row>
    );
  }

  if (!media) {
    return (
      <Container as="main" className={styles.page}>
        <PullToRefresh
          pullingContent=""
          onRefresh={refreshMedia}
          refreshingContent={<Spinner />}
        >
          <Column gap="xl">
            <Header variant="plain" leading={<MediaDetailBackLink />} />
            <section className={styles.heroSection}>
              <MediaDetailHeroSkeleton />
            </section>
          </Column>
        </PullToRefresh>
      </Container>
    );
  }

  return (
    <Container as="main" className={styles.page}>
      <PullToRefresh
        pullingContent=""
        onRefresh={refreshMedia}
        refreshingContent={<Spinner />}
      >
        <Column gap="xl">
          <Header variant="plain" leading={<MediaDetailBackLink />} />

          <ComponentErrorBoundary resetKeys={[mediaId]}>
            <MediaDetailHero media={media} userId={userId} />
          </ComponentErrorBoundary>

          <ComponentErrorBoundary resetKeys={[mediaId]}>
            <MediaInformation
              media={media}
              malId={detail?.malId}
              language={i18n.language}
            />
          </ComponentErrorBoundary>
          <ComponentErrorBoundary resetKeys={[mediaId]}>
            <MediaDescription media={media} />
          </ComponentErrorBoundary>
          <ComponentErrorBoundary resetKeys={[mediaId]}>
            <MediaScreenshots detail={detail} />
          </ComponentErrorBoundary>
          <MediaRelations
            userId={userId}
            mediaId={mediaId}
            contentMode={contentMode}
          />
          <MediaReviews userId={userId} mediaId={mediaId} />
          <MediaRecommendations
            userId={userId}
            mediaId={mediaId}
            contentMode={contentMode}
          />
          <ComponentErrorBoundary resetKeys={[mediaId]}>
            <MediaTags tags={tags} />
          </ComponentErrorBoundary>
        </Column>
      </PullToRefresh>
    </Container>
  );
}
