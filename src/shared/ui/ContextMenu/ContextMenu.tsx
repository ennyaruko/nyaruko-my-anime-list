import type { ComponentPropsWithRef, ComponentPropsWithoutRef } from "react";

import clsx from "clsx";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";

import * as styles from "./ContextMenu.css";

export type ContextMenuProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Root
>;

export type ContextMenuTriggerProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Trigger
>;

export type ContextMenuContentProps = ComponentPropsWithRef<
  typeof ContextMenuPrimitive.Content
>;

export type ContextMenuItemProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Item
> & {
  tone?: "default" | "destructive";
};

export type ContextMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Separator
>;

export type ContextMenuSubProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Sub
>;

export type ContextMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubTrigger
>;

export type ContextMenuSubContentProps = ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.SubContent
>;

export function ContextMenu({ modal = false, ...props }: ContextMenuProps) {
  return <ContextMenuPrimitive.Root {...props} modal={modal} />;
}

export function ContextMenuTrigger({
  className,
  ...props
}: ContextMenuTriggerProps) {
  return <ContextMenuPrimitive.Trigger {...props} className={className} />;
}

export function ContextMenuContent({
  className,
  ...props
}: ContextMenuContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        {...props}
        className={clsx(styles.content, className)}
      />
    </ContextMenuPrimitive.Portal>
  );
}

export function ContextMenuItem({
  className,
  tone = "default",
  ...props
}: ContextMenuItemProps) {
  return (
    <ContextMenuPrimitive.Item
      {...props}
      className={clsx(styles.item, styles.itemTone[tone], className)}
    />
  );
}

export function ContextMenuSeparator({
  className,
  ...props
}: ContextMenuSeparatorProps) {
  return (
    <ContextMenuPrimitive.Separator
      {...props}
      className={clsx(styles.separator, className)}
    />
  );
}

export function ContextMenuSub(props: ContextMenuSubProps) {
  return <ContextMenuPrimitive.Sub {...props} />;
}

export function ContextMenuSubTrigger({
  className,
  ...props
}: ContextMenuSubTriggerProps) {
  return (
    <ContextMenuPrimitive.SubTrigger
      {...props}
      className={clsx(
        styles.item,
        styles.itemTone.default,
        styles.subTrigger,
        className,
      )}
    />
  );
}

export function ContextMenuSubContent({
  className,
  ...props
}: ContextMenuSubContentProps) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        {...props}
        className={clsx(styles.content, styles.subContent, className)}
      />
    </ContextMenuPrimitive.Portal>
  );
}
