import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/shared/ui";
import { useAppService, queryCacheConfig } from "@/shared/lib";
import type {
  MarkupVariant,
  TextTranslations,
} from "@/shared/lib/content-markup";

import { translationServiceToken } from "../model/translation-service";

import * as styles from "./TranslatedContent.css";

type TranslatedContentProps = {
  content: string;
  variant: MarkupVariant;
  extraTexts?: readonly string[];
  children: (translations: TextTranslations) => ReactNode;
};

/** Kept mounted only in Ru mode so returning to En aborts unused requests. */
export function TranslatedContent({
  content,
  variant,
  children,
  extraTexts = [],
}: TranslatedContentProps) {
  const { t } = useTranslation(["common"]);
  const service = useAppService(translationServiceToken);
  const queryClient = useQueryClient();
  const hasContent = Boolean(
    content.trim() || extraTexts.some((text) => text.trim()),
  );
  const queryKey = queryCacheConfig.families.contentTranslation.key(
    content,
    variant,
    extraTexts,
  );
  const query = useQuery({
    queryKey,
    retry: false,
    staleTime: Infinity,
    gcTime: 30 * 60_000,
    throwOnError: false,
    enabled: hasContent,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      const { getContentTexts } = await import("@/shared/lib/content-markup");
      signal.throwIfAborted();
      const texts = [
        ...new Set([...extraTexts, ...getContentTexts(content, variant)]),
      ].filter((text) => text.trim());
      return texts.length ? service.translate(texts, signal) : {};
    },
  });
  return (
    <>
      {hasContent && (query.isPending || query.isError) && (
        <div className={styles.status}>
          <span>
            {query.isError || query.isPaused
              ? t("common:translation.failed")
              : t("common:translation.loading")}
          </span>
          {query.isError && (
            <Button
              size="s"
              variant="flat"
              onClick={() =>
                void queryClient.resetQueries({ queryKey, exact: true })
              }
            >
              {t("common:translation.retry")}
            </Button>
          )}
        </div>
      )}
      {children(query.data ?? {})}
    </>
  );
}
