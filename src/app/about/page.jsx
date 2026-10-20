import BestCustomerReviews from "@/components/about/BestCustomerReviews";
import ExpertiseSection from "@/components/about/ExpertiseSection";
import HowWeWork from "@/components/about/HowWeWork";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import HeroBanner from "@/components/HeroBanner";
import MarqueHighlightText from "@/components/MarqueHighlightText";
import { pageMeta } from "@/utility/pageMeta";
export const metadata = pageMeta({
  path: "/about",
  title: "About - New York Commercial Clean Team INC",
  description:
    "Meet New York Commercial Clean Team: fully insured, background-checked commercial cleaners serving offices, retail and medical facilities across all five boroughs.",
});
export default function AboutUs() {
  return (
    <main>
      <HeroBanner
        imageURL="/images/banners/about-us.webp"
        title="Built on Accountability. Trusted Across NYC."
        pageName="About"
        desc="Fully insured, background-checked commercial cleaning — serving offices, retail, medical,
and more across all five boroughs."
      />
      <ExpertiseSection />{" "}
      <MarqueHighlightText marqueeText="Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference. Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference." />
      <WhyChooseUs />
      <HowWeWork />
      <BestCustomerReviews />
    </main>
  );
}
