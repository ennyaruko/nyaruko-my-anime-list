import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type { Media } from "@/entities/media";

import { Heading } from "@/shared/ui";
import { skeletonAnimation } from "@/shared/styles";

import { MarkdownContent } from "../MarkdownContent";

import * as styles from "./MediaDescription.css";
import * as pageStyles from "../MediaDetailPage.css";

export function MediaDescription({ media }: { media: Media | undefined }) {
  const { t } = useTranslation(["common"]);

  return (
    <section className={pageStyles.section}>
      <Heading size="m" variant="neutral">
        {t("common:mediaDetail.description")}
      </Heading>
      {media ? (
        media.description ? (
          <MarkdownContent variant="description">
            {media.description}
          </MarkdownContent>
        ) : (
          <p className={styles.descriptionEmpty}>
            {t("common:mediaDetail.emptyDescription")}
          </p>
        )
      ) : (
        <DescriptionSkeleton />
      )}
    </section>
  );
}

function DescriptionSkeleton() {
  return (
    <div className={styles.descriptionSkeleton}>
      {Array.from({ length: 5 }, (_, index) => {
        const widthVariant = [
          "long",
          "medium",
          "long",
          "medium",
          "short",
        ] as const;

        return (
          <span
            key={index}
            className={clsx(
              styles.descriptionSkeletonLine,
              styles.descriptionSkeletonWidth[widthVariant[index]],
              skeletonAnimation,
            )}
          />
        );
      })}
    </div>
  );
}
