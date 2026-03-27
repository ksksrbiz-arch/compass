/**
 * HTML escape utility — prevents XSS when interpolating user data.
 */
const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const ESCAPE_RE = /[&<>"']/g

export function escapeHtml(str) {
  if (typeof str !== 'string') return ''
  return str.replace(ESCAPE_RE, (ch) => ESCAPE_MAP[ch])
}

/**
 * Sanitize a markdown/text string:
 * - Escapes raw HTML tags
 * - Blocks javascript: links (and other dangerous protocols)
 */
const DANGEROUS_PROTOCOL_RE = /(?:javascript|vbscript|data)\s*:/gi

export function sanitizeMarkdown(text) {
  if (typeof text !== 'string') return ''
  let safe = escapeHtml(text)
  safe = safe.replace(DANGEROUS_PROTOCOL_RE, '')
  return safe
}
