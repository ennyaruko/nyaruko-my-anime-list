import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

import { MediaCarousel } from "@/widgets/media-carousel";

import { MediaCardContextMenu } from "@/features/manage-media-list";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountState } from "@/entities/account";

import {
  Column,
  Container,
  QueryErrorBoundary,
  BlockStatusNotFound,
} from "@/shared/ui";

import { useTrendingMedia } from "../model/useTrendingMedia";

import * as styles from "./NotFoundPage.css";

export function NotFoundPage() {
  const accountState = useOutletContext<AccountState>();

  return (
    <Container as="main" className={styles.page}>
      <Column gap="m">
        <div className={styles.notFound}>
          <BlockStatusNotFound className={styles.illustration} />
        </div>
        <QueryErrorBoundary>
          <TrendingSection accountState={accountState} />
        </QueryErrorBoundary>
      </Column>
    </Container>
  );
}

function TrendingSection({ accountState }: { accountState: AccountState }) {
  const { t } = useTranslation(["common"]);
  const trending = useTrendingMedia(accountState);

  return (
    <MediaCarousel
      items={trending.media}
      getKey={(media) => media.id}
      isPending={trending.isPending}
      hasNextPage={trending.hasNextPage}
      title={t("common:notFound.trending")}
      onFetchNextPage={trending.fetchNextPage}
      isFetchingNextPage={trending.isFetchingNextPage}
      renderSkeleton={() => <MediaCardSkeleton size="s" />}
      renderItem={(media) => (
        <MediaCardContextMenu
          size="s"
          media={media}
          userId={accountState.account?.id}
        />
      )}
    />
  );
}
