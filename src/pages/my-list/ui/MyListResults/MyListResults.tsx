import { MediaCardContextMenu } from "@/features/manage-media-list";

import { type MyListEntry, MediaCardSkeleton } from "@/entities/media";

import { GridList, BlockStatusEmpty } from "@/shared/ui";

import * as styles from "./MyListResults.css";

type MyListResultsProps = {
  isPending: boolean;
  entries: MyListEntry[];
  userId: string | undefined;
};

export function MyListResults({
  userId,
  entries,
  isPending,
}: MyListResultsProps) {
  return isPending ? (
    <GridList
      renderItem={() => <MediaCardSkeleton size="l" />}
      data={Array.from({ length: 4 }, (_, index) => index)}
    />
  ) : entries.length === 0 ? (
    <BlockStatusEmpty className={styles.empty} />
  ) : (
    <GridList
      virtualize
      data={entries}
      getKey={(entry) => entry.id}
      renderItem={(entry) => (
        <MediaCardContextMenu size="l" media={entry} userId={userId} />
      )}
    />
  );
}
