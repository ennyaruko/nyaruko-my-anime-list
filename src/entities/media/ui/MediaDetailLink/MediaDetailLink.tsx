import { Link } from "react-router";
import type { LinkProps } from "react-router";

import type { Media } from "../../model/media";

export type MediaDetailLinkProps = Omit<LinkProps, "to" | "media" | "state"> & {
  media: Media;
};

/** Link to a media detail page with its card data available immediately. */
export function MediaDetailLink({ media, ...linkProps }: MediaDetailLinkProps) {
  return <Link {...linkProps} state={{ media }} to={`/media/${media.id}`} />;
}
