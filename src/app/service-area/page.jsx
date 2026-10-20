import HeroBanner from "@/components/HeroBanner";
import Available from "@/components/service-area/Available";
import Coverage from "@/components/service-area/Coverage";
import Foundation from "@/components/service-area/Foundation";
import { pageMeta } from "@/utility/pageMeta";
export const metadata = pageMeta({
  path: "/service-area",
  title: "Locations - New York Commercial Clean Team INC",
  description:
    "Commercial cleaning in Manhattan, Brooklyn, Queens, the Bronx, Staten Island and Long Island. Local teams with consistent standards in every borough.",
});
export default function ServieArea() {
  return (
    <main>
       <HeroBanner imageURL="/images/banners/location.webp" title="Commercial Cleaning Across New York City" pageName="Locations" desc="Manhattan, Brooklyn, Queens, the Bronx, Staten Island, and Long Island — local teams, consistent standards."/>
        <Foundation/>
        <Coverage/>
        <Available/>
    </main>
  )
}
