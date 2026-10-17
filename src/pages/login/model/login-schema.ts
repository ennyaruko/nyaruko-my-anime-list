import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(1, "Введите пароль"),
  login: z
    .string()
    .trim()
    .min(1, "Введите имя пользователя")
    .regex(/^[^а-яё]*$/i, "Имя пользователя не должно содержать кириллицу"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
