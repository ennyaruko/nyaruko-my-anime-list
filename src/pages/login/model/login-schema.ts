import { z } from "zod";
import type { TFunction } from "i18next";

export function createLoginSchema(t: TFunction<["login", "validation"]>) {
  return z.object({
    password: z.string().min(1, t("validation:passwordRequired")),
    login: z
      .string()
      .trim()
      .min(1, t("validation:loginRequired"))
      .regex(/^[^а-яё]*$/i, t("validation:loginLatinOnly")),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
