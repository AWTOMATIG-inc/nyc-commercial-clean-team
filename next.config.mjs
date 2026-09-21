/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/services/office-cleaning", destination: "/services/recurring/office-cleaning", permanent: true },
      { source: "/services/janitorial-services", destination: "/services/recurring/janitorial-services", permanent: true },
      { source: "/services/day-porter-services", destination: "/services/recurring/day-porter-services", permanent: true },
      { source: "/service-area/available/office-cleaning", destination: "/services/recurring/office-cleaning", permanent: true },
      { source: "/service-area/available/janitorial-services", destination: "/services/recurring/janitorial-services", permanent: true },
      { source: "/service-area/available/day-porter-services", destination: "/services/recurring/day-porter-services", permanent: true },
      { source: "/service-area/available/post-construction-cleaning", destination: "/services/specialty/post-construction-cleaning", permanent: true },
      { source: "/service-area/available/carpet-cleaning", destination: "/services/surface/carpet-cleaning", permanent: true },
      { source: "/service-area/available/window-cleaning", destination: "/services/surface/window-cleaning", permanent: true },
    ];
  },
};

export default nextConfig;
