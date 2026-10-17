import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { PropsWithChildren } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import { LockIcon, UserIcon } from "@/shared/icons";
import { Column, ControlledInput } from "@/shared/ui";

import { createLoginSchema, type LoginFormValues } from "../model/login-schema";

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
};

export function LoginForm({
  children,
  onSubmit,
}: PropsWithChildren<LoginFormProps>) {
  const { t } = useTranslation(["login", "validation"]);
  const schema = useMemo(() => createLoginSchema(t), [t]);
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: { login: "", password: "" },
  });
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (hasErrors) {
      void trigger();
    }
  }, [hasErrors, schema, trigger]);

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Column gap="m">
        <ControlledInput
          round
          shadow
          size="l"
          cleanable
          name="login"
          control={control}
          autoComplete="username"
          leftSlot={<UserIcon />}
          placeholder={t("login:usernamePlaceholder")}
        />

        <ControlledInput
          round
          shadow
          size="l"
          cleanable
          name="password"
          type="password"
          control={control}
          leftSlot={<LockIcon />}
          autoComplete="current-password"
          placeholder={t("login:passwordPlaceholder")}
        />
        {children}
      </Column>
    </form>
  );
}
