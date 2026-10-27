import { Link } from "react-router";
import ReactMarkdown, { type Components } from "react-markdown";

import clsx from "clsx";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import * as styles from "./MarkdownContent.css";

export type MarkdownContentProps = {
  children: string;
  variant: "review" | "description";
};

function getMarkdownComponents(
  variant: MarkdownContentProps["variant"],
): Components {
  return {
    hr: () => <hr className={styles.divider} />,
    ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
    ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
    li: ({ children }) => <li className={styles.listItem}>{children}</li>,
    em: ({ children }) => <em className={styles.emphasis}>{children}</em>,
    center: ({ children }) => <div className={styles.center}>{children}</div>,
    b: ({ children }) => <strong className={styles.strong}>{children}</strong>,
    strong: ({ children }) => (
      <strong className={styles.strong}>{children}</strong>
    ),
    div: ({ node, children }) => (
      <div className={getAlignmentClass(node)}>{children}</div>
    ),
    blockquote: ({ children }) => (
      <blockquote className={styles.quote}>{children}</blockquote>
    ),
    h1: ({ node, children }) => (
      <h1 className={clsx(styles.heading, getAlignmentClass(node))}>
        {children}
      </h1>
    ),
    h2: ({ node, children }) => (
      <h2 className={clsx(styles.heading, getAlignmentClass(node))}>
        {children}
      </h2>
    ),
    h3: ({ node, children }) => (
      <h3 className={clsx(styles.heading, getAlignmentClass(node))}>
        {children}
      </h3>
    ),
    h4: ({ node, children }) => (
      <h4 className={clsx(styles.heading, getAlignmentClass(node))}>
        {children}
      </h4>
    ),
    h5: ({ node, children }) => (
      <h5 className={clsx(styles.heading, getAlignmentClass(node))}>
        {children}
      </h5>
    ),
    h6: ({ node, children }) => (
      <h6 className={clsx(styles.heading, getAlignmentClass(node))}>
        {children}
      </h6>
    ),
    p: ({ node, children }) => (
      <p className={clsx(styles.paragraph[variant], getAlignmentClass(node))}>
        {children}
      </p>
    ),
    img: ({ alt, src }) =>
      src ? (
        <img
          src={src}
          loading="lazy"
          alt={alt ?? ""}
          className={styles.image}
        />
      ) : null,
    a: ({ href, title, children }) => {
      if (!href) return <>{children}</>;

      const hasProtocol = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href);
      const isWebUrl = /^(?:https?:)?\/\//i.test(href);

      if (hasProtocol) {
        return (
          <a
            href={href}
            title={title}
            className={styles.link}
            target={isWebUrl ? "_blank" : undefined}
            rel={isWebUrl ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      }

      return (
        <Link to={href} title={title} target="_blank" className={styles.link}>
          {children}
        </Link>
      );
    },
  };
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "center"],
  attributes: {
    ...defaultSchema.attributes,
    p: [
      ...(defaultSchema.attributes?.p ?? []),
      ["align", "left", "center", "right", "justify"],
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      ["align", "left", "center", "right", "justify"],
    ],
  },
};

/** Renders sanitized AniList Markdown and its supported HTML formatting. */
export function MarkdownContent({ variant, children }: MarkdownContentProps) {
  const markdown = normalizeMarkdown(children, variant);

  return (
    <div className={styles.content[variant]}>
      <ReactMarkdown
        components={getMarkdownComponents(variant)}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

function normalizeMarkdown(
  content: string,
  variant: MarkdownContentProps["variant"],
) {
  const withoutEmbeddedStyles = content.replace(
    /<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,
    "",
  );

  const normalized =
    variant === "review"
      ? normalizeReviewHeadings(withoutEmbeddedStyles)
      : withoutEmbeddedStyles;

  return normalizeInlineMarkdown(normalized);
}

function normalizeInlineMarkdown(content: string) {
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]*`)/g);

  return parts
    .map((part, index) => {
      if (index % 2 !== 0) return part;

      const links: string[] = [];

      const protectedPart = part.replace(
        /\[([^\]\n]+)\]\(([^)\s]+)\)/g,
        (_match, label: string, url: string) => {
          const safeLabel = label
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

          const safeUrl = url
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

          const linkIndex =
            links.push(`<a href="${safeUrl}">${safeLabel}</a>`) - 1;

          return `\u0000LINK${linkIndex}\u0000`;
        },
      );

      const formatted = protectedPart
        // **bold**
        .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
        // __bold__
        .replace(/__([^_\n]+?)__/g, "<strong>$1</strong>")
        // _italic_
        .replace(/(^|[^\w])_([^_\n]+?)_(?!\w)/g, "$1<em>$2</em>")
        // *italic*
        .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

      return formatted.replace(
        // eslint-disable-next-line no-control-regex
        /\u0000LINK(\d+)\u0000/g,
        (_match, linkIndex: string) => links[Number(linkIndex)],
      );
    })
    .join("");
}

function getAlignmentClass(node: unknown) {
  const align = (node as undefined | { properties?: { align?: unknown } })
    ?.properties?.align;

  if (
    align === "left" ||
    align === "right" ||
    align === "center" ||
    align === "justify"
  ) {
    return styles.alignment[align];
  }

  return undefined;
}

function normalizeReviewHeadings(body: string) {
  return body
    .replace(/_{3,}\s*([^\n]+?)\s*_{3,}/g, "<h4>$1</h4>")
    .replace(/__([^_\n]+?)__/g, "<strong>$1</strong>");
}
