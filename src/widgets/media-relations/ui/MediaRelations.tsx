import { useTranslation } from "react-i18next";

import { MediaListContextMenu } from "@/features/manage-media-list";

import { CompactCard, CompactCardSkeleton } from "@/entities/media";
import type { MediaRelation, MediaRelationType } from "@/entities/media";

import { Column, Heading } from "@/shared/ui";

import { useMediaRelations } from "../model/useMediaRelations";

import * as styles from "./MediaRelations.css";

const relationLabelKey = {
  OTHER: "common:mediaDetail.relationType.other",
  PARENT: "common:mediaDetail.relationType.parent",
  SOURCE: "common:mediaDetail.relationType.source",
  SEQUEL: "common:mediaDetail.relationType.sequel",
  PREQUEL: "common:mediaDetail.relationType.prequel",
  SUMMARY: "common:mediaDetail.relationType.summary",
  SPIN_OFF: "common:mediaDetail.relationType.spinOff",
  CONTAINS: "common:mediaDetail.relationType.contains",
  CHARACTER: "common:mediaDetail.relationType.character",
  SIDE_STORY: "common:mediaDetail.relationType.sideStory",
  ADAPTATION: "common:mediaDetail.relationType.adaptation",
  ALTERNATIVE: "common:mediaDetail.relationType.alternative",
  COMPILATION: "common:mediaDetail.relationType.compilation",
  SAME_UNIVERSE: "common:mediaDetail.relationType.sameUniverse",
} as const satisfies Record<MediaRelationType, string>;

type MediaRelationsProps = {
  mediaId: number;
  userId: string | undefined;
};

export function MediaRelations({ userId, mediaId }: MediaRelationsProps) {
  const { t } = useTranslation(["common"]);
  const relationsQuery = useMediaRelations({ userId, mediaId });
  const relations = relationsQuery.data;

  if (relationsQuery.isError || relations?.length === 0) return null;

  return (
    <section className={styles.section}>
      <Heading size="m" variant="neutral">
        {t("common:mediaDetail.relations")}
      </Heading>
      {relations ? (
        <Column gap="m">
          {relations.map(({ type, media }, index) => (
            <RelatedMediaCard
              type={type}
              media={media}
              userId={userId}
              key={`${media.id}-${type ?? index}`}
            />
          ))}
        </Column>
      ) : (
        <RelationsSkeleton />
      )}
    </section>
  );
}

function RelatedMediaCard({
  type,
  media,
  userId,
}: MediaRelation & { userId: string | undefined }) {
  const { t } = useTranslation(["common"]);
  const relationKey = type ? relationLabelKey[type] : undefined;
  const label = relationKey
    ? t(relationKey)
    : (type?.replaceAll("_", " ").toLowerCase() ?? "");

  return (
    <MediaListContextMenu media={media} userId={userId}>
      <CompactCard media={media} relationLabel={label} />
    </MediaListContextMenu>
  );
}

function RelationsSkeleton() {
  return (
    <div className={styles.relationSkeletonList}>
      <CompactCardSkeleton />
    </div>
  );
}
