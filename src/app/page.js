import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhySection from "@/components/home/WhySection";
import { getFeedback } from "@/utility/getFeedback";
import dynamic from "next/dynamic";

const DynamicIndusriesSection = dynamic(
  () => import("@/components/home/IndusriesSection"),
);
const DynamicStandardsSection = dynamic(
  () => import("@/components/home/StandardsSection"),
);
const DynamicPartnershipSection = dynamic(
  () => import("@/components/home/PartnershipSection"),
);
const DynamicCoverageSection = dynamic(
  () => import("@/components/home/CoverageSection"),
);
const DynamicClientVoices = dynamic(
  () => import("@/components/home/ClientVoices"),
);
const DynamicMarqueHighlightText = dynamic(
  () => import("@/components/MarqueHighlightText"),
);
const DynamicFAQs = dynamic(() => import("@/components/home/FAQs"));
export const metadata = {
  title: "New York Commercial Clean Team INC",
  description:
    "professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference",
  links: [
    {
      rel: "preload",
      as: "image",
      href: "/images/videoplaceholder.webp",
      fetchPriority: "high",
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "New York Commercial Clean Team Inc",
  url: "https://nyccleantinc.com",
  telephone: "+16313817252",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
    addressRegion: "NY",
    addressCountry: "US",
  },
  areaServed: [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island",
    "Long Island",
  ],
  serviceType: "Commercial Cleaning",
  priceRange: "$$",
  openingHours: "Mo-Fr 08:00-18:00",
};
export default async function Home() {
  const feedbacks = await getFeedback();
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <HeroSection />
      <WhySection />
      <ServicesSection />
      <DynamicIndusriesSection />
      <DynamicStandardsSection />
      <DynamicPartnershipSection />
      <DynamicCoverageSection />
      <DynamicClientVoices feedbacks={feedbacks} />
      <DynamicMarqueHighlightText marqueeText="Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference. Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference." />
      <DynamicFAQs />
    </main>
  );
}
