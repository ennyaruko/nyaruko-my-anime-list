/** Provider-neutral public profile returned by the current-account query. */
export type AccountProfile = {
  id: string;
  username: string;
  avatarUrl?: null | string;
  profileUrl?: null | string;
};
