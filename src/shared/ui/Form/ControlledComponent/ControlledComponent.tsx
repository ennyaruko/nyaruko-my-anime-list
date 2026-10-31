import type { ReactNode } from "react";
import { Controller } from "react-hook-form";
import type {
  Control,
  FieldPath,
  FieldValues,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

import clsx from "clsx";

import * as styles from "./ControlledComponent.css";

export type ControlledComponentProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  name: TName;
  message?: string;
  className?: string;
  control: Control<TFieldValues>;
  renderComponent: (
    field: ControllerRenderProps<TFieldValues, TName>,
    fieldState: ControllerFieldState,
  ) => ReactNode;
};

export function ControlledComponent<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  message,
  className,
  renderComponent,
}: ControlledComponentProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message ?? message;

        return (
          <div className={clsx(styles.root, className)}>
            {renderComponent(field, fieldState)}
            {errorMessage && (
              <span className={styles.error}>{errorMessage}</span>
            )}
          </div>
        );
      }}
    />
  );
}
