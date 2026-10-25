import type { Media, PartialDate, MediaListStatus } from "./media";

export type MyListStatus = MediaListStatus;

/** A media item together with required list status and entry metadata. */
export type MyListEntry = Omit<Media, "status"> & {
  /** Timestamp when the list entry was created (Unix seconds). */
  createdAt: number;
  /** Timestamp when the list entry was last updated (Unix seconds). */
  updatedAt: number;
  /** Non-null status because this entry is present in the user's list. */
  status: MyListStatus;
  /** Date the user started watching. */
  startedAt: null | PartialDate;
  /** Date the user completed watching. */
  completedAt: null | PartialDate;
};

/** A user's entries grouped by a list status. */
export type MyListEntries = {
  /** Entries with the status shown below. */
  list: MyListEntry[];
  /** Status shared by the entries in this group. */
  status: MyListStatus;
};

/** All list groups returned for a user. */
export type MyListCollection = MyListEntries[];
