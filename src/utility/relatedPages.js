// Builds internal links between the CMS landing pages from the slugs that
// actually exist, so no link can point at a page that isn't there.
// Slugs follow "{service}-{location}", e.g. "day-porter-services-brooklyn".
const LOCATIONS = [
  { key: "manhattan-nyc", label: "Manhattan" },
  { key: "staten-island", label: "Staten Island" },
  { key: "long-island", label: "Long Island" },
  { key: "manhattan", label: "Manhattan" },
  { key: "brooklyn", label: "Brooklyn" },
  { key: "queens", label: "Queens" },
  { key: "bronx", label: "Bronx" },
  { key: "nyc", label: "NYC" },
];

// Borough hub slugs use "commercial-cleaning-services-manhattan-nyc"; fold them
// into the same service as "commercial-cleaning-{borough}".
const SERVICE_ALIASES = { "commercial-cleaning-services": "commercial-cleaning" };

const titleCase = (s) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const parse = (slug) => {
  const loc = LOCATIONS.find(({ key }) => slug.endsWith(`-${key}`));
  if (!loc) return null;
  const raw = slug.slice(0, -(loc.key.length + 1));
  const service = SERVICE_ALIASES[raw] || raw;
  return { slug, service, location: loc.label };
};

const toLink = ({ slug, service, location }) => ({
  href: `/${slug}`,
  label: `${titleCase(service)} in ${location}`,
});

export function getRelatedPages(slug, allSlugs, limit = 6) {
  const current = parse(slug);
  if (!current) return { sameService: [], sameLocation: [] };
  const parsed = allSlugs.map(parse).filter((p) => p && p.slug !== slug);

  const sameService = parsed
    .filter((p) => p.service === current.service)
    .slice(0, limit)
    .map(toLink);

  // One page per other service, in the same location as the current page.
  const seen = new Set();
  const sameLocation = parsed
    .filter((p) => p.location === current.location && p.service !== current.service)
    .filter((p) => !seen.has(p.service) && seen.add(p.service))
    .slice(0, limit + 2)
    .map(toLink);

  return { sameService, sameLocation, location: current.location };
}
