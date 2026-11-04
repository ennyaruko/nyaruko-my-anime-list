import { MediaCardContextMenu } from "@/features/manage-media-list";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountState } from "@/entities/account";
import type { MediaSearchParameters } from "@/entities/media";

import { GridList, BlockStatusEmpty } from "@/shared/ui";

import { useMediaSearchResults } from "../../model/useMediaSearchResults";

import * as styles from "./MediaSearchResults.css";

const SKELETON_COUNT = 6;
export type MediaSearchResultsProps = {
  account: AccountState["account"];
  parameters: MediaSearchParameters;
};

export function MediaSearchResults({
  account,
  parameters,
}: MediaSearchResultsProps) {
  const { results, loadMore, isPending, isFetchingNextPage } =
    useMediaSearchResults({ account, parameters });
  const skeletons = isFetchingNextPage ? (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <MediaCardSkeleton size="l" key={index} />
      ))}
    </div>
  ) : null;

  return (
    <div className={styles.resultsContainer}>
      {isPending ? (
        <GridList
          renderItem={() => <MediaCardSkeleton size="l" />}
          data={Array.from({ length: SKELETON_COUNT }, (_, index) => index)}
        />
      ) : results.length === 0 ? (
        <BlockStatusEmpty className={styles.empty} />
      ) : (
        <GridList
          virtualize
          data={results}
          footer={skeletons}
          endReached={loadMore}
          getKey={(media) => media.id}
          renderItem={(media) => (
            <MediaCardContextMenu size="l" media={media} userId={account?.id} />
          )}
        />
      )}
    </div>
  );
}
