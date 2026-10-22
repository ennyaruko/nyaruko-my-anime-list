import { AccountProfile } from "./account-provider";

export type AccountState = {
  accountError: boolean;
  accountPending: boolean;
  account: undefined | AccountProfile;
};
