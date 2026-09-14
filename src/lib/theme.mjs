/**
 * Theme colour helpers. Monochrome themes (brand = accent = ink = near-black)
 * are legitimate — many installers' logos are black — but they break any rule
 * that paints `--accent` or `--brand` on a dark background, or that lets the
 * global `a:hover { color: var(--brand) }` win on a dark button. Everything
 * here is computed once at build time and exposed as extra CSS variables.
 */

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two hex colours (1..21). */
export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Derived variables for the theme. Components use these instead of raw
 * `--accent` / `--brand` wherever the background is dark (footer, ink
 * sections) so a black-on-black theme still reads.
 */
export function derivedVars(t) {
  const onDark = contrast(t.accent, t.ink) >= 3 ? t.accent : '#FFFFFF';
  const brandOnDark = contrast(t.brand, t.ink) >= 3 ? t.brand : '#FFFFFF';
  // Text colour for a brand-filled pill on a dark ground: white on a real
  // brand colour, ink when the "brand" had to fall back to white.
  const brandOnDarkInk = brandOnDark === '#FFFFFF' ? t.ink : '#FFFFFF';
  return { '--accent-on-dark': onDark, '--brand-on-dark': brandOnDark, '--brand-on-dark-ink': brandOnDarkInk };
}

/** Problems a human would spot on hover / in the footer. Used by scripts/qa.mjs. */
export function themeIssues(t) {
  const issues = [];
  const accentInk = t.accentInk ?? t.ink;
  if (contrast(t.accent, accentInk) < 4.5)
    issues.push(`theme: accent ${t.accent} vs accentInk ${accentInk} contrast ${contrast(t.accent, accentInk).toFixed(1)} < 4.5 — CTA text unreadable. Set theme.accentInk.`);
  if (contrast(t.brand, '#FFFFFF') < 4.5)
    issues.push(`theme: brand ${t.brand} on white contrast ${contrast(t.brand, '#FFFFFF').toFixed(1)} < 4.5 — links and primary buttons unreadable.`);
  if (contrast(t.ink, t.surface) < 7)
    issues.push(`theme: ink ${t.ink} on surface ${t.surface} contrast ${contrast(t.ink, t.surface).toFixed(1)} < 7 — body copy on cards too faint.`);
  return issues;
}
