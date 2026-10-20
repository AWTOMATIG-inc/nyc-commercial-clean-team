import HeroBanner from "@/components/HeroBanner";
import CleaningQuote from "@/components/services/CleaningQuote";
import RecurringSection from "@/components/services/RecurringSection";
import SpecialitySection from "@/components/services/SpecialitySection";
import SupportSection from "@/components/services/SupportSection";
import SurfacesSection from "@/components/services/SurfacesSection";
import { pageMeta } from "@/utility/pageMeta";
export const metadata = pageMeta({
  path: "/services",
  title: "Services - New York Commercial Clean Team INC",
  description:
    "Recurring janitorial, specialty, surface and support cleaning services built for NYC commercial facilities, from offices and retail to medical spaces.",
});
export default function page() {
  return (
    <main>
        <HeroBanner imageURL="/images/banners/services.webp" title="Commercial Cleaning Done Right" desc="Every service we offer is built for commercial facilities — offices, retail, medical, and more"/>
        <RecurringSection/>
        <SpecialitySection/>
        <SurfacesSection/>
        <SupportSection/>
        <CleaningQuote/>
    </main>
  )
}
