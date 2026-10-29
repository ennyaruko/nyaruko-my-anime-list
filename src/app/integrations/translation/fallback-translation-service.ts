import type { TranslationService } from "@/features/translate-content";

/** Tries each configured provider for each text, without knowing provider details. */
export function createFallbackTranslationService(
  providers: readonly TranslationService[],
): TranslationService {
  return {
    async translate(texts, signal) {
      const translations: [string, string][] = [];

      for (const text of new Set(texts)) {
        let lastError: unknown;
        let translated = false;

        for (const provider of providers) {
          signal.throwIfAborted();
          try {
            const result = await provider.translate([text], signal);
            const translation = result[text];
            if (typeof translation !== "string" || !translation.trim()) {
              throw new Error("Translation provider returned no translation");
            }
            translations.push([text, translation]);
            translated = true;
            break;
          } catch (error) {
            if (signal.aborted) throw error;
            lastError = error;
          }
        }

        if (!translated) {
          if (lastError !== undefined) throw lastError;
          throw new Error("No translation providers are configured");
        }
      }

      return Object.fromEntries(translations);
    },
  };
}
