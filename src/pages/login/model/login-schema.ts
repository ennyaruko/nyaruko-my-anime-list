import { z } from "zod";
import type { TFunction } from "i18next";

export function createLoginSchema(t: TFunction<["common"]>) {
  return z.object({
    password: z.string().min(1, t("common:validation.passwordRequired")),
    login: z
      .string()
      .trim()
      .min(1, t("common:validation.loginRequired"))
      .regex(/^[^а-яё]*$/i, t("common:validation.loginLatinOnly")),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
