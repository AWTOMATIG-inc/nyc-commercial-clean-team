import ClientVoices from "@/components/home/ClientVoices";
import CoverageSection from "@/components/home/CoverageSection";
import FAQs from "@/components/home/FAQs";
import HeroSection from "@/components/home/HeroSection";
import IndusriesSection from "@/components/home/IndusriesSection";
import PartnershipSection from "@/components/home/PartnershipSection";
import ServicesSection from "@/components/home/ServicesSection";
import StandardsSection from "@/components/home/StandardsSection";
import WhySection from "@/components/home/WhySection";
import MarqueHighlightText from "@/components/MarqueHighlightText";

export default function Home() {
  return (
    <main>
      <HeroSection/>
      <WhySection/>
      <ServicesSection/>
      <IndusriesSection/>
      <StandardsSection/>
      <PartnershipSection/>
      <CoverageSection/>
      <ClientVoices/>
      <MarqueHighlightText marqueeText="Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference. Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference."/>
      <FAQs/>
    </main>
  );
}
