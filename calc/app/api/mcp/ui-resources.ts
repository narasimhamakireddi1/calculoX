// MCP Apps UI extension (io.modelcontextprotocol/ui, spec 2026-01-26) wiring.
//
// The official @modelcontextprotocol/ext-apps helper package peer-depends on the v1
// @modelcontextprotocol/sdk's McpServer class, but this server is built on mcp-handler
// 2.x + @modelcontextprotocol/server (v2) — a different, incompatible SDK generation.
// The wire format itself is simple and documented as directly usable without the v1-only
// helper (see the package's own "legacy format" example): a tool's `_meta.ui.resourceUri`
// points at a `ui://` resource; the host fetches it and renders the HTML in a sandboxed
// iframe. That's implemented by hand here against the v2 server's own
// registerTool/registerResource — no v1 SDK dependency needed.
//
// v1 scope: each resource is a small static HTML wrapper iframing the real calculator's
// /embed/<calc> page (reusing the actual site UI, not a rebuilt widget) at its default
// values — not the caller's specific numbers. Making the resource reflect the exact
// values from a given tool call needs a URI template (RFC 6570) plus a currently-unclear
// per-call `_meta` override in this SDK version; deferred until there's a host with
// working MCP Apps rendering to verify against (Claude Desktop negotiates but doesn't
// render yet as of this research — see modelcontextprotocol/ext-apps#671).

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.calculox.in';

// MIME type MCP Apps hosts use to identify HTML content as an MCP App UI resource
// (matches the RESOURCE_MIME_TYPE constant in @modelcontextprotocol/ext-apps).
const APP_HTML_MIME_TYPE = 'text/html;profile=mcp-app';

function widgetHtml(embedPath: string, title: string): string {
  const src = `${BASE_URL}/embed/${embedPath}`;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<style>
  html, body { margin: 0; padding: 0; height: 100%; }
  iframe { width: 100%; height: 100%; min-height: 640px; border: 0; display: block; }
</style>
</head>
<body>
<iframe src="${src}" title="${title}" loading="eager"></iframe>
</body>
</html>`;
}

export interface McpUiResourceDef {
  /** Tool name this resource is attached to (calculate_emi, calculate_sip, ...). */
  toolName: string;
  resourceUri: string;
  resourceName: string;
  embedPath: string;
  title: string;
}

export const MCP_UI_RESOURCES: McpUiResourceDef[] = [
  { toolName: 'calculate_emi', resourceUri: 'ui://calculox/emi-calculator', resourceName: 'emi-calculator-widget', embedPath: 'emi-calculator', title: 'EMI Calculator' },
  { toolName: 'calculate_sip', resourceUri: 'ui://calculox/sip-calculator', resourceName: 'sip-calculator-widget', embedPath: 'sip-calculator', title: 'SIP Calculator' },
  { toolName: 'calculate_bmi', resourceUri: 'ui://calculox/bmi-calculator', resourceName: 'bmi-calculator-widget', embedPath: 'bmi-calculator', title: 'BMI Calculator' },
  { toolName: 'calculate_income_tax', resourceUri: 'ui://calculox/tax-calculator', resourceName: 'tax-calculator-widget', embedPath: 'tax-calculator', title: 'Income Tax Calculator' },
];

// A host that doesn't understand the `ui` extension simply ignores this field per the
// spec's additive-metadata design, so tools keep working (plain content/structuredContent)
// in every host — this is purely additive on top of the Phase 1 tools.
export function uiMeta(resourceUri: string) {
  return { ui: { resourceUri } };
}

interface RegisterResourceServer {
  registerResource: (
    name: string,
    uri: string,
    config: { mimeType: string; title?: string },
    readCallback: (uri: URL) => { contents: Array<{ uri: string; mimeType: string; text: string }> }
  ) => unknown;
}

export function registerUiResources(server: RegisterResourceServer) {
  for (const def of MCP_UI_RESOURCES) {
    server.registerResource(
      def.resourceName,
      def.resourceUri,
      { mimeType: APP_HTML_MIME_TYPE, title: def.title },
      (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: APP_HTML_MIME_TYPE,
            text: widgetHtml(def.embedPath, def.title),
          },
        ],
      })
    );
  }
}
