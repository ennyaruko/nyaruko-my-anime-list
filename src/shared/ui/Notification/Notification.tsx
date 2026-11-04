import { ToastContainer } from "react-toastify";

import * as styles from "./Notification.css";

export function NotificationContainer() {
  return (
    <ToastContainer
      closeOnClick
      icon={false}
      theme="colored"
      autoClose={1000}
      closeButton={false}
      position="top-right"
      className={styles.toastContainer}
    />
  );
}
