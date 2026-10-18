import type { ReactNode } from "react";
import { toast } from "react-toastify";

export type NotificationVariant = "info" | "error" | "success" | "warning";

export type ShowNotification = (
  message: ReactNode,
  variant?: NotificationVariant,
) => void;

export const showNotification: ShowNotification = (
  message,
  variant = "info",
) => {
  toast(message, { type: variant });
};
