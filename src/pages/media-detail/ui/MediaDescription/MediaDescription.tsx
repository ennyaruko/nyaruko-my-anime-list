import { useTranslation } from "react-i18next";

import clsx from "clsx";

import {
  TranslatedContent,
  useContentLanguage,
  ContentLanguageControls,
} from "@/features/translate-content";

import type { Media } from "@/entities/media";

import { Heading } from "@/shared/ui";
import { MarkdownContent } from "@/shared/ui";
import { skeletonAnimation } from "@/shared/styles";

import * as styles from "./MediaDescription.css";
import * as pageStyles from "../MediaDetailPage.css";

export function MediaDescription({ media }: { media: Media | undefined }) {
  const { t } = useTranslation(["common"]);
  const { language, setLanguage } = useContentLanguage(
    media?.id ?? "description",
    "description",
  );

  return (
    <section className={pageStyles.section}>
      <Heading
        size="m"
        variant="neutral"
        action={
          media?.description ? (
            <ContentLanguageControls
              language={language}
              onChange={setLanguage}
            />
          ) : undefined
        }
      >
        {t("common:mediaDetail.description")}
      </Heading>
      {media ? (
        media.description ? (
          language === "ru" ? (
            <TranslatedContent
              key={media.id}
              variant="description"
              content={media.description}
            >
              {(translations) => (
                <MarkdownContent
                  variant="description"
                  translations={translations}
                >
                  {media.description!}
                </MarkdownContent>
              )}
            </TranslatedContent>
          ) : (
            <MarkdownContent variant="description">
              {media.description}
            </MarkdownContent>
          )
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
