import { unified } from "unified";
import rehypeRaw from "rehype-raw";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { type Options, defaultSchema } from "rehype-sanitize";

export type MarkupVariant = "review" | "description";
export type TextTranslations = Readonly<Record<string, string>>;
type TextNode = {
  type: string;
  value?: string;
  tagName?: string;
  children?: TextNode[];
};

export const sanitizeSchema: Options = {
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

export function normalizeMarkdown(content: string, variant: MarkupVariant) {
  const withoutEmbeddedStyles = content.replace(
    /<style\b[^>]*>[\s\S]*?<\/style\s*>/gi,
    "",
  );

  const normalized =
    variant === "review"
      ? normalizeReviewHeadings(
          normalizeReviewCodeMarkup(withoutEmbeddedStyles),
        )
      : withoutEmbeddedStyles;

  return normalizeInlineMarkdown(normalized);
}

/** Unwraps AniList reviews accidentally serialized as escaped HTML in code. */
function normalizeReviewCodeMarkup(content: string) {
  return content.replace(
    /<pre\b[^>]*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (block, body: string) => {
      if (!/&lt;\/?(?:img|center|span)\b/i.test(body)) return block;

      return body
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/^[ \t]+/gm, "")
        .replace(/~~~\s*$/, "");
    },
  );
}

function normalizeInlineMarkdown(content: string) {
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]*`)/g);

  return parts
    .map((part, index) => {
      if (index % 2 !== 0) return part;

      const links: string[] = [];

      const protectedPart = part.replace(
        /(!?)\[([^\]\n]+)\]\(([^)\s]+)\)/g,
        (match, image: string, label: string, url: string) => {
          if (image) {
            const imageIndex = links.push(match) - 1;
            return `\u0000LINK${imageIndex}\u0000`;
          }
          const safeUrl = url
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

          const linkIndex =
            // Preserve inline markup in the label; rehype-sanitize runs after
            // rehype-raw and removes unsupported or unsafe elements.
            links.push(`<a href="${safeUrl}">${label}</a>`) - 1;

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

function normalizeReviewHeadings(body: string) {
  return body
    .replace(/_{3,}\s*([^\n]+?)\s*_{3,}/g, "<h4>$1</h4>")
    .replace(/__([^_\n]+?)__/g, "<strong>$1</strong>");
}

function visitText(
  node: TextNode,
  visit: (node: TextNode & { value: string }) => void,
) {
  if (node.tagName === "code" || node.tagName === "pre") return;
  if (
    node.type === "text" &&
    typeof node.value === "string" &&
    /\p{L}/u.test(node.value)
  ) {
    visit(node as TextNode & { value: string });
  }
  node.children?.forEach((child) => visitText(child, visit));
}

/** Extracts only visible prose; markup, URLs, image sources and code stay intact. */
export function getContentTexts(
  source: string,
  variant: MarkupVariant,
): string[] {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, sanitizeSchema);
  const tree = processor.runSync(
    processor.parse(normalizeMarkdown(source, variant)),
  );
  const texts = new Set<string>();
  visitText(tree, (node) => texts.add(node.value));
  return [...texts];
}

/** Runs after sanitization and inserts translations as text, never as HTML. */
export function replaceTranslatedText(translations: TextTranslations) {
  return () => (tree: TextNode) => {
    visitText(tree, (node) => {
      if (Object.hasOwn(translations, node.value))
        node.value = translations[node.value];
    });
  };
}
