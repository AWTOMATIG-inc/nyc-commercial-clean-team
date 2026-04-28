import BestCustomerReviews from '@/components/about/BestCustomerReviews'
import ExpertiseSection from '@/components/about/ExpertiseSection'
import WhyChooseUs from '@/components/about/WhyChooseUs'
import HeroBanner from '@/components/HeroBanner'
import MarqueHighlightText from '@/components/MarqueHighlightText'
export const metadata = {
  title: "About - New York Commercial Clean Team INC",
  description: "professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference",
};
export default function AboutUs() {
  return (
    <main>
        <HeroBanner title="Built on Accountability. Trusted Across NYC." pageName="About" desc="Fully insured, background-checked commercial cleaning — serving offices, retail, medical, and more across all five boroughs."/>
        <ExpertiseSection/> <MarqueHighlightText marqueeText="Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference. Making Every Corner Shine. Professional Cleaning You Can Trust! Your Space, Our Care. Experience the Clean Difference."/>
        <WhyChooseUs/>
        <BestCustomerReviews/>
    </main>
  )
}
