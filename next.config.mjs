/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // www -> non-www (GSC fix 10-4-26, Fix 6): Google had indexed both hosts, splitting ranking
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nyccleantinc.com" }],
        destination: "https://nyccleantinc.com/:path*",
        permanent: true,
      },

      // Old pre-rename URLs -> point straight at the final "keep" pages (no double hop)
      { source: "/services/office-cleaning", destination: "/commercial-office-cleaning-nyc", permanent: true },
      { source: "/services/janitorial-services", destination: "/janitorial-services-nyc", permanent: true },
      { source: "/services/day-porter-services", destination: "/day-porter-services-nyc", permanent: true },
      { source: "/service-area/available/office-cleaning", destination: "/commercial-office-cleaning-nyc", permanent: true },
      { source: "/service-area/available/janitorial-services", destination: "/janitorial-services-nyc", permanent: true },
      { source: "/service-area/available/day-porter-services", destination: "/day-porter-services-nyc", permanent: true },
      { source: "/service-area/available/post-construction-cleaning", destination: "/post-construction-cleaning-nyc", permanent: true },
      { source: "/service-area/available/carpet-cleaning", destination: "/commercial-carpet-cleaning-nyc", permanent: true },
      { source: "/service-area/available/window-cleaning", destination: "/commercial-window-cleaning-nyc", permanent: true },

      // GSC fix (10-4-26): duplicate service pages -> stronger keyword pages
      { source: "/services/recurring/office-cleaning", destination: "/commercial-office-cleaning-nyc", permanent: true },
      { source: "/services/recurring/janitorial-services", destination: "/janitorial-services-nyc", permanent: true },
      { source: "/services/recurring/day-porter-services", destination: "/day-porter-services-nyc", permanent: true },
      { source: "/services/specialty/post-construction-cleaning", destination: "/post-construction-cleaning-nyc", permanent: true },
      { source: "/services/specialty/deep-cleaning-disinfection", destination: "/commercial-deep-cleaning-nyc", permanent: true },
      { source: "/services/specialty/move-out-event-cleaning", destination: "/commercial-move-out-cleaning-nyc", permanent: true },
      { source: "/services/surface/floor-strip-and-wax", destination: "/floor-stripping-waxing-nyc", permanent: true },
      { source: "/services/surface/carpet-cleaning", destination: "/commercial-carpet-cleaning-nyc", permanent: true },
      { source: "/services/surface/window-cleaning", destination: "/commercial-window-cleaning-nyc", permanent: true },
      { source: "/services/support/handyman-services", destination: "/commercial-handyman-services-nyc", permanent: true },
      { source: "/services/support/restroom-supply-management", destination: "/restroom-supply-management-nyc", permanent: true },

      // GSC fix (10-4-26): duplicate service-area pages -> stronger keyword pages
      { source: "/service-area/queens", destination: "/commercial-cleaning-queens", permanent: true },
      { source: "/service-area/brooklyn", destination: "/commercial-cleaning-brooklyn", permanent: true },
      { source: "/service-area/manhattan", destination: "/commercial-cleaning-services-manhattan-nyc", permanent: true },
      { source: "/service-area/bronx", destination: "/commercial-cleaning-bronx", permanent: true },
      { source: "/service-area/long-island", destination: "/commercial-cleaning-long-island", permanent: true },
    ];
  },
};

export default nextConfig;
