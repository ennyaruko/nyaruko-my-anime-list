import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";
import { mediaDetailServiceToken } from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import { Button, Column, Header, BackLink, Container } from "@/shared/ui";

import { WatchContent } from "./WatchContent";

import * as styles from "./MediaWatchPage.css";

type MediaWatchPageProps = {
  mediaId: number;
  userId: string | undefined;
};

export function MediaWatchPage({ userId, mediaId }: MediaWatchPageProps) {
  const { t } = useTranslation(["common"]);
  const { accessToken } = useAuth();
  const service = useAppService(mediaDetailServiceToken);
  const validMediaId = Number.isSafeInteger(mediaId) && mediaId > 0;
  const query = useQuery({
    enabled: Boolean(accessToken && userId && validMediaId),
    queryFn: ({ signal }) =>
      service.getMediaDetail(accessToken!, mediaId, signal),
    queryKey: queryCacheConfig.families.mediaDetail.key(
      userId ?? "unknown",
      mediaId,
    ),
  });

  return (
    <Container as="main" className={styles.page}>
      <Column gap="xl">
        <Header
          variant="plain"
          leading={<BackLink>{t("common:mediaDetail.back")}</BackLink>}
        />
        {query.data ? (
          <WatchContent
            userId={userId}
            detail={query.data}
            key={`${userId}:${mediaId}`}
          />
        ) : query.isError || !validMediaId ? (
          <div role="alert">
            {t("common:watch.loadFailed")}
            <Button variant="flat" onClick={() => void query.refetch()}>
              {t("common:watch.retry")}
            </Button>
          </div>
        ) : (
          <p role="status">{t("common:loading")}</p>
        )}
      </Column>
    </Container>
  );
}
