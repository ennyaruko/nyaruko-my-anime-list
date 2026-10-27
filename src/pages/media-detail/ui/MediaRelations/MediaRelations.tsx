import { useTranslation } from "react-i18next";

import { MediaListContextMenu } from "@/features/manage-media-list";

import type { MediaRelation } from "@/entities/media";
import { CompactCard, CompactCardSkeleton } from "@/entities/media";

import { Column, Heading } from "@/shared/ui";

import { useMediaRelations } from "../../model/useMediaRelations";

import * as styles from "./MediaRelations.css";
import * as pageStyles from "../MediaDetailPage.css";

const relationLabelKey = {
  PARENT: "common:mediaDetail.relationType.parent",
  SOURCE: "common:mediaDetail.relationType.source",
  SEQUEL: "common:mediaDetail.relationType.sequel",
  PREQUEL: "common:mediaDetail.relationType.prequel",
  SUMMARY: "common:mediaDetail.relationType.summary",
  SPIN_OFF: "common:mediaDetail.relationType.spinOff",
  CONTAINS: "common:mediaDetail.relationType.contains",
  CHARACTER: "common:mediaDetail.relationType.character",
  SIDE_STORY: "common:mediaDetail.relationType.sideStory",
  FULL_STORY: "common:mediaDetail.relationType.fullStory",
  ADAPTATION: "common:mediaDetail.relationType.adaptation",
  ALTERNATIVE: "common:mediaDetail.relationType.alternative",
  ALTERNATIVE_SETTING: "common:mediaDetail.relationType.alternativeSetting",
  ALTERNATIVE_VERSION: "common:mediaDetail.relationType.alternativeVersion",
} as const;

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
    <section className={pageStyles.section}>
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
  const relationKey = type
    ? relationLabelKey[type as keyof typeof relationLabelKey]
    : undefined;
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
