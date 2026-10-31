import type { AccountProfile } from "./account";

/** Current account query state shared through authenticated route context. */
export type AccountState = {
  /** Whether loading the current profile failed. */
  accountError: boolean;
  /** Whether the current profile is still loading. */
  accountPending: boolean;
  /** Current profile, once it has been loaded. */
  account: undefined | AccountProfile;
};
