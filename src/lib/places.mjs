/**
 * Geography helpers for area pages.
 *
 * Nearby-area links are the cheapest local-SEO win a small site has: they turn
 * a set of dead-end town pages into a crawlable cluster, and they are genuinely
 * useful to a visitor whose village has no page of its own. Computed from real
 * coordinates rather than hand-maintained lists, so adding an area file is
 * enough — nothing to keep in sync.
 */
const R = 6371;
const rad = (d) => (d * Math.PI) / 180;

export function distanceKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Nearest `limit` areas to `entry`. Areas with no `geo` are ordered after the
 * ones that have it, so a client who has not added coordinates still gets
 * links (just not distance-sorted) rather than an empty block.
 */
export function nearbyAreas(entry, areas, limit = 3) {
  const here = entry.data.geo;
  const others = areas.filter((a) => a.id !== entry.id);
  if (!here) return others.slice(0, limit).map((a) => ({ entry: a, km: null }));
  return others
    .map((a) => ({ entry: a, km: a.data.geo ? distanceKm(here, a.data.geo) : Infinity }))
    .sort((x, y) => x.km - y.km)
    .slice(0, limit)
    .map((x) => ({ entry: x.entry, km: Number.isFinite(x.km) ? Math.round(x.km) : null }));
}
