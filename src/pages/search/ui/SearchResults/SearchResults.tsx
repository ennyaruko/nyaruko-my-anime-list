import { MediaCardContextMenu } from "@/features/manage-media-list";

import { MediaCardSkeleton } from "@/entities/media";
import type { AccountState } from "@/entities/account";
import type { MediaSearchParameters } from "@/entities/media";

import { GridList, BlockStatusEmpty } from "@/shared/ui";

import { useSearchResults } from "../../model/useSearchResults";

import * as styles from "./SearchResults.css";

const SKELETON_COUNT = 6;
type SearchResultsProps = {
  account: AccountState["account"];
  parameters: MediaSearchParameters;
};

export function SearchResults({ account, parameters }: SearchResultsProps) {
  const { results, loadMore, isPending, isFetchingNextPage } = useSearchResults(
    { account, parameters },
  );
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
