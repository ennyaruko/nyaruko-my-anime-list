import { useContext, type ButtonHTMLAttributes } from "react";

import { DrawerContext } from "./DrawerContext";

export type DrawerCloseProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function DrawerClose({
  onClick,
  type = "button",
  ...props
}: DrawerCloseProps) {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error(
      "DrawerClose должен находиться внутри компонента <Drawer>.",
    );
  }

  return (
    <button
      {...props}
      type={type}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.close();
      }}
    />
  );
}
