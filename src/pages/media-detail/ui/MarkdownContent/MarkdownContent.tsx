import { Link } from "react-router";
import ReactMarkdown, { type Components } from "react-markdown";

import clsx from "clsx";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

import {
  sanitizeSchema,
  normalizeMarkdown,
  replaceTranslatedText,
  type TextTranslations,
} from "@/shared/lib/content-markup";

import * as styles from "./MarkdownContent.css";

export type MarkdownContentProps = {
  children: string;
  translations?: TextTranslations;
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

/** Renders sanitized AniList Markdown and its supported HTML formatting. */
export function MarkdownContent({
  variant,
  children,
  translations = {},
}: MarkdownContentProps) {
  const markdown = normalizeMarkdown(children, variant);

  return (
    <div className={styles.content[variant]}>
      <ReactMarkdown
        components={getMarkdownComponents(variant)}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema],
          replaceTranslatedText(translations),
        ]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
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
