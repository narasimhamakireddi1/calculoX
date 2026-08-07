// Exposes calculox's existing blog guides as standard MCP resources (not the MCP Apps
// `ui://` extension used in ui-resources.ts — these are plain text, meant to be read as
// grounding context by the model, not rendered as a widget). One resource per post,
// registered once at server init from the same lib/blog/posts.ts data the site itself
// renders, so there's no separate content to keep in sync.
import { blogPosts, type BlogPost } from '@/lib/blog/posts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

function postToMarkdown(post: BlogPost): string {
  const parts: string[] = [
    `# ${post.title}`,
    '',
    post.description,
    '',
    `Source: ${BASE_URL}/blog/${post.slug}`,
    `Category: ${post.category} | Last updated: ${post.lastUpdated || post.date}`,
    '',
  ];

  for (const section of post.sections) {
    parts.push(`## ${section.heading}`, '', section.content, '');
  }

  if (post.faqs.length > 0) {
    parts.push('## FAQs', '');
    for (const faq of post.faqs) {
      parts.push(`**${faq.question}**`, '', faq.answer, '');
    }
  }

  return parts.join('\n');
}

interface RegisterResourceServer {
  registerResource: (
    name: string,
    uri: string,
    config: { mimeType: string; title?: string; description?: string },
    readCallback: (uri: URL) => { contents: Array<{ uri: string; mimeType: string; text: string }> }
  ) => unknown;
}

export function registerBlogResources(server: RegisterResourceServer) {
  for (const post of blogPosts) {
    server.registerResource(
      `blog-${post.slug}`,
      `blog://calculox/${post.slug}`,
      { mimeType: 'text/markdown', title: post.title, description: post.description },
      (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: 'text/markdown',
            text: postToMarkdown(post),
          },
        ],
      })
    );
  }
}
