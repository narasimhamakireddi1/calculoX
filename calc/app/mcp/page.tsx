import type { Metadata } from 'next';
import Link from 'next/link';
import { Plug, Wrench, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { CopyCodeBlock } from '@/components/ui/CopyCodeBlock';
import { mcpTools } from '@/config/mcp-tools.config';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';
const MCP_URL = `${BASE_URL}/api/mcp`;

export const metadata: Metadata = {
  title: 'MCP Server — Connect calculox to Claude, ChatGPT & Your AI Assistant',
  description:
    'calculox is available as a remote MCP server: 14 verified financial, health, and utility calculator tools your AI assistant can call directly, plus 24 blog guides as reference resources. Setup instructions for Claude, ChatGPT, and VS Code.',
  alternates: { canonical: `${BASE_URL}/mcp` },
  openGraph: {
    title: 'calculox MCP Server',
    description:
      '14 verified calculator tools and 24 reference guides, callable from any MCP-compatible AI assistant.',
    url: `${BASE_URL}/mcp`,
    type: 'website',
  },
};

const claudeDesktopConfig = `{
  "mcpServers": {
    "calculox": {
      "url": "${MCP_URL}"
    }
  }
}`;

const claudeCodeCommand = `claude mcp add --transport http calculox ${MCP_URL}`;

const vscodeConfig = `{
  "servers": {
    "calculox": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`;

export default function McpPage() {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'calculox MCP Server',
    url: `${BASE_URL}/mcp`,
    description: 'Remote MCP server exposing calculox calculators as tools for AI assistants.',
    isPartOf: { '@type': 'WebSite', name: 'calculox', url: BASE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white">MCP Server</span>
        </nav>

        {/* Hero */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800 flex items-center justify-center flex-shrink-0">
            <Plug className="w-8 h-8 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">calculox MCP Server</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Connect calculox to Claude, ChatGPT, or any MCP-compatible AI assistant — same verified
              formulas as the website, callable directly from your conversation.
            </p>
          </div>
        </div>

        {/* What this is */}
        <section className="mb-10 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">What&apos;s exposed</h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              <strong>{mcpTools.length} calculator tools</strong> — EMI, SIP, income tax, FD, RD, GST, CAGR,
              simple interest, percentage, profit margin, retirement corpus, home loan vs rent, BMI, and a
              scientific expression evaluator. Each one calls the exact same calculation engine as the
              matching page on this site, so the numbers always match.
            </li>
            <li>
              <strong>4 visual widgets</strong> — the EMI, SIP, BMI, and income tax tools also expose an{' '}
              <a href="https://modelcontextprotocol.io/extensions/apps/overview" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5">
                MCP Apps<ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>{' '}
              interactive UI — the same calculator page, embedded inline in a supporting host, pre-filled
              with the numbers the tool just computed. Host support for this is still rolling out; if your
              client doesn&apos;t render it yet, the tool still returns a plain text/JSON result.
            </li>
            <li>
              <strong>24 blog guides</strong> as reference resources — calculox&apos;s own explainer articles
              (how EMI is calculated, old vs new tax regime, SIP vs lump sum, etc.), available for a model to
              read as grounding context.
            </li>
          </ul>
        </section>

        {/* Server URL */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Server URL</h2>
          <CopyCodeBlock code={MCP_URL} />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Streamable HTTP, unauthenticated (these are free public calculators, no account or API key
            needed).
          </p>
        </section>

        {/* Setup instructions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Connect your client</h2>

          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Claude Desktop</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Add to your <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">claude_desktop_config.json</code> (Settings → Developer → Edit Config), then restart Claude Desktop.
              </p>
              <CopyCodeBlock code={claudeDesktopConfig} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Claude Code</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Run in your terminal:</p>
              <CopyCodeBlock code={claudeCodeCommand} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">VS Code (GitHub Copilot)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Create <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">.vscode/mcp.json</code> in your workspace:
              </p>
              <CopyCodeBlock code={vscodeConfig} />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ChatGPT</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Settings → Apps → Advanced settings → enable <strong>Developer mode</strong>, then Settings →
                Connectors → <strong>Create</strong>. Paste the server URL above, set Authentication to{' '}
                <strong>None</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Tools list */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
            Available tools
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-5">
            Every tool validates input the same way its calculator page does and returns a structured
            result. Click a tool&apos;s name to see the matching calculator on the site.
          </p>
          <div className="space-y-3">
            {mcpTools.map((tool) => (
              <div key={tool.name} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={tool.href} className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {tool.name}
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
                  </div>
                  {tool.hasWidget && (
                    <span className="flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" aria-hidden="true" /> Widget
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources note */}
        <section className="mb-10 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
            Blog resources
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            All 24 guides from the <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">calculox blog</Link>{' '}
            are also available as MCP resources (<code className="text-xs bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded">blog://calculox/&lt;slug&gt;</code>),
            for a model to reference alongside a tool call — e.g. reading the EMI guide while also calling
            <code className="text-xs bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded ml-1">calculate_emi</code>.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center space-x-3">
          <Link
            href="/verification-methodology"
            className="inline-block px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-semibold rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            How results are verified
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Explore the calculators →
          </Link>
        </div>
      </div>
    </>
  );
}
