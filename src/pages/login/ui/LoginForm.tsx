import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LockIcon, UserIcon } from "@/shared/icons";
import { Column, ControlledInput } from "@/shared/ui";

import { loginSchema, type LoginFormValues } from "../model/login-schema";

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
};

export function LoginForm({
  children,
  onSubmit,
}: PropsWithChildren<LoginFormProps>) {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  });

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
          placeholder="Логин пользователя"
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
          placeholder="Введите пароль"
          autoComplete="current-password"
        />
        {children}
      </Column>
    </form>
  );
}
