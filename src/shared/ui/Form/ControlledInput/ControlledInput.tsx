import { Controller } from "react-hook-form";
import type { ChangeEventHandler } from "react";
import type { Control, FieldValues, FieldPathByValue } from "react-hook-form";

import clsx from "clsx";

import { Input, type InputProps } from "../../Input";

import * as styles from "./ControlledInput.css";

type ControlledValue = InputProps["value"];

export type ControlledInputProps<TFieldValues extends FieldValues> = Omit<
  InputProps,
  "value" | "onClear" | "onChange" | "defaultValue"
> & {
  message?: string;
  onClear?: VoidFunction;
  control: Control<TFieldValues>;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  name: FieldPathByValue<TFieldValues, ControlledValue>;
};

export function ControlledInput<TFieldValues extends FieldValues>({
  name,
  control,
  message,
  onClear,
  onChange,
  ...inputProps
}: ControlledInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message ?? message;

        return (
          <div className={styles.root}>
            <Input
              {...inputProps}
              name={field.name}
              onBlur={field.onBlur}
              value={field.value ?? ""}
              onClear={() => {
                field.onChange("");
                onClear?.();
              }}
              onChange={(event) => {
                field.onChange(event);
                onChange?.(event);
              }}
              className={clsx(inputProps.className, {
                [styles.inputError]: Boolean(fieldState.error),
              })}
            />
            {errorMessage && (
              <span className={styles.error}>{errorMessage}</span>
            )}
          </div>
        );
      }}
    />
  );
}
