import type { ReactNode } from "react";
import { toast } from "react-toastify";

import type { NotificationVariant } from "./Notification";

export type ShowNotification = (
  message: ReactNode,
  variant?: NotificationVariant,
) => void;

export const showNotification: ShowNotification = (message, variant = "info") => {
  toast(message, { type: variant });
};
