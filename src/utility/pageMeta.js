const SITE_URL = "https://nyccleantinc.com";

// Next.js replaces (not merges) the root layout's openGraph object when a page
// sets its own, so the share image has to be repeated here.
const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/home/services/floor-moping.jpg`,
  width: 1200,
  height: 630,
  alt: "Floor Moping Service",
};

export function pageMeta({ path, title, description }) {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      url,
      title,
      description,
      siteName: "NYC Clean Commercial Team",
      locale: "en_US",
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
