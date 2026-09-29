/** Sanitized markdown renderer (rehype-sanitize allowlist). */
import { unified } from "unified";

export async function MarkdownRenderer({ markdown }: { markdown: string }): Promise<React.JSX.Element> {
  const { default: remarkParse } = await import("remark-parse");
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: remarkRehype } = await import("remark-rehype");
  const { default: rehypeSanitize } = await import("rehype-sanitize");
  const { default: rehypeStringify } = await import("rehype-stringify");
  const file = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(markdown);
  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: String(file) }} />;
}
