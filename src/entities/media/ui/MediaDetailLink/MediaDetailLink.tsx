import type { LinkProps } from "react-router";
import { Link, useLocation } from "react-router";

import type { Media } from "../../model/media";

export type MediaDetailLinkProps = Omit<LinkProps, "to" | "media" | "state"> & {
  media: Media;
};

/** Link to a media detail page that preserves the current location for Back. */
export function MediaDetailLink({ media, ...linkProps }: MediaDetailLinkProps) {
  const { search, pathname } = useLocation();

  return (
    <Link
      {...linkProps}
      to={`/media/${media.id}`}
      state={{ media, from: `${pathname}${search}` }}
    />
  );
}
