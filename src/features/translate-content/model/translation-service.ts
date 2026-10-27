import { createServiceToken } from "@/shared/lib";
import type { TextTranslations } from "@/shared/lib/content-markup";

export type TranslationService = {
  translate: (
    texts: readonly string[],
    signal: AbortSignal,
  ) => Promise<TextTranslations>;
};

export const translationServiceToken =
  createServiceToken<TranslationService>("translationService");
