import { Dialog as DialogPrimitive } from "radix-ui";

import * as styles from "./Dialog.css";

export function DialogDemo() {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger className={styles.close}>
        Open Radix Dialog
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.overlay} />

        <DialogPrimitive.Content className={styles.content}>
          <DialogPrimitive.Title className={styles.title}>
            Radix + vanilla-extract
          </DialogPrimitive.Title>

          <DialogPrimitive.Description className={styles.description}>
            The primitive supplies behavior and accessibility. The design system
            supplies all visual styling and theme tokens.
          </DialogPrimitive.Description>

          <div className={styles.actions}>
            <DialogPrimitive.Close className={styles.close}>
              Close
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
